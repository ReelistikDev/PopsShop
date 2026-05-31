"use server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export type OrderUpdate = {
  status?: string;
  payment_status?: string;
  quote_amount?: number | null;
  deposit_amount?: number | null;
  due_date?: string | null;
  shipping_address?: string | null;
  shipping_carrier?: string | null;
  tracking_number?: string | null;
  shipping_status?: string | null;
  admin_notes?: string | null;
};

export async function updateOrderAction(id: string, updates: OrderUpdate) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };

  // If approving, ensure a payment token exists so the admin can copy/share the
  // /pay/<token> link. Square handles the receipt/confirmation to the customer.
  if (updates.status === "approved") {
    const { data: current } = await sb
      .from("woodworking_orders")
      .select("status, payment_token")
      .eq("id", id)
      .single();

    if (current && current.status !== "approved" && !current.payment_token) {
      await sb
        .from("woodworking_orders")
        .update({ payment_token: crypto.randomUUID() })
        .eq("id", id);
    }
  }

  const { error } = await sb.from("woodworking_orders").update(updates).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/shipping");
  revalidatePath("/admin/finances");
  return { ok: true };
}
