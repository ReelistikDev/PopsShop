"use server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export type OrderUpdate = {
  status?: string;
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
  const { error } = await sb.from("woodworking_orders").update(updates).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/shipping");
  return { ok: true };
}
