"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { sendOrderSms } from "@/lib/twilio";

export async function saveCustomOrderAction(data: {
  customerName: string;
  phone: string;
  email?: string;
  category?: string;
  product?: string;
  dimensions?: string;
  woodType?: string;
  finish?: string;
  quantity?: string;
  budget?: string;
  deadline?: string;
  notes?: string;
}): Promise<{ ok: boolean }> {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return { ok: false };

    const { data: inserted, error } = await sb
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
        status: "new",
        sms_status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[saveCustomOrder] insert failed:", error.message);
      return { ok: false };
    }

    const lines = [
      "🪵 New piece request",
      `Name: ${data.customerName}`,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : null,
      data.category ? `Category: ${data.category}` : null,
      data.product ? `Product: ${data.product}` : null,
      data.budget ? `Budget: ${data.budget}` : null,
      data.deadline ? `Needed by: ${data.deadline}` : null,
      data.notes ? `Notes: ${data.notes}` : null,
    ].filter(Boolean).join("\n");

    const sms = await sendOrderSms(lines);

    if (inserted?.id) {
      await sb
        .from("woodworking_orders")
        .update({ sms_status: sms.ok ? "sent" : "failed" })
        .eq("id", inserted.id);
    }

    return { ok: true };
  } catch (err) {
    console.error("[saveCustomOrder] error:", err);
    return { ok: false };
  }
}
