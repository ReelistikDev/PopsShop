"use server";

import { redirect } from "next/navigation";
import { orderSchema, type OrderInput } from "@/lib/validation";
import { getSupabaseAdmin, ORDER_PHOTO_BUCKET } from "@/lib/supabase";
import { sendOrderSms } from "@/lib/twilio";

export type OrderState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<keyof OrderInput, string>>;
};

const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB

export async function submitOrder(
  _prev: OrderState,
  formData: FormData,
): Promise<OrderState> {
  // Honeypot: real users never fill this hidden field. Pretend success for bots.
  if (typeof formData.get("company") === "string" && (formData.get("company") as string).trim()) {
    redirect("/confirmation");
  }

  const parsed = orderSchema.safeParse({
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    category: formData.get("category"),
    product: formData.get("product"),
    dimensions: formData.get("dimensions"),
    woodType: formData.get("woodType"),
    finish: formData.get("finish"),
    quantity: formData.get("quantity"),
    budget: formData.get("budget"),
    deadline: formData.get("deadline"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    const fieldErrors: OrderState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof OrderInput;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const supabase = getSupabaseAdmin();

  // 1) Optional inspiration photo → Supabase Storage.
  let photoUrl: string | undefined;
  const photo = formData.get("photo");
  if (
    supabase &&
    photo instanceof File &&
    photo.size > 0 &&
    photo.size <= MAX_PHOTO_BYTES &&
    photo.type.startsWith("image/")
  ) {
    try {
      const ext = photo.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
      const bytes = new Uint8Array(await photo.arrayBuffer());
      const { error: uploadErr } = await supabase.storage
        .from(ORDER_PHOTO_BUCKET)
        .upload(path, bytes, { contentType: photo.type, upsert: false });
      if (uploadErr) {
        console.error("[submitOrder] photo upload failed:", uploadErr.message);
      } else {
        photoUrl = supabase.storage.from(ORDER_PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
      }
    } catch (err) {
      console.error("[submitOrder] photo upload threw:", err);
    }
  }

  // 2) Save the order first so a Twilio outage can never lose a lead.
  let orderId: string | undefined;
  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("woodworking_orders")
      .insert({
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email || null,
        category: data.category || null,
        product: data.product || null,
        dimensions: data.dimensions || null,
        wood_type: data.woodType || null,
        finish: data.finish || null,
        quantity: data.quantity || null,
        budget: data.budget || null,
        deadline: data.deadline || null,
        notes: data.notes || null,
        photo_url: photoUrl || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[submitOrder] insert failed:", error.message);
      return {
        ok: false,
        message:
          "Something went wrong saving your request. Please try again, or give us a call.",
      };
    }
    orderId = inserted?.id as string | undefined;
  } else {
    console.error(
      "[submitOrder] Supabase not configured — order was NOT persisted. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  // 3) Text the business with the full order.
  const sms = await sendOrderSms(buildSmsBody(data, photoUrl));
  if (!sms.ok) {
    console.error("[submitOrder] SMS not sent:", sms.error);
  }

  // 4) Best-effort: record how the SMS went.
  if (supabase && orderId) {
    await supabase
      .from("woodworking_orders")
      .update({ sms_status: sms.ok ? "sent" : "failed" })
      .eq("id", orderId);
  }

  // redirect() throws — keep it last and outside any try/catch.
  const firstName = data.customerName.split(" ")[0] ?? "";
  redirect(`/confirmation?name=${encodeURIComponent(firstName)}`);
}

function buildSmsBody(data: OrderInput, photoUrl?: string): string {
  const lines: string[] = ["🪵 New LB's Wood-Crafts order request", ""];
  const add = (label: string, value?: string) => {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  };
  add("Name", data.customerName);
  add("Phone", data.phone);
  add("Email", data.email);
  add("Category", data.category);
  add("Product", data.product);
  add("Dimensions", data.dimensions);
  add("Wood", data.woodType);
  add("Finish/Color", data.finish);
  add("Qty", data.quantity);
  add("Budget", data.budget);
  add("Needed by", data.deadline);
  add("Notes", data.notes);
  add("Photo", photoUrl);
  return lines.join("\n");
}
