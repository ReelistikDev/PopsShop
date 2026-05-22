"use server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendPaymentEmail } from "@/lib/email";

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

  // If approving, generate a payment token (if missing) and send payment email
  if (updates.status === "approved") {
    const { data: current } = await sb
      .from("woodworking_orders")
      .select(
        "status, payment_token, email, customer_name, product, category, quote_amount, deposit_amount"
      )
      .eq("id", id)
      .single();

    if (current && current.status !== "approved") {
      const token: string = current.payment_token ?? crypto.randomUUID();

      if (!current.payment_token) {
        await sb
          .from("woodworking_orders")
          .update({ payment_token: token })
          .eq("id", id);
      }

      if (current.email) {
        sendPaymentEmail({
          customer_name: current.customer_name,
          email: current.email,
          product: current.product,
          category: current.category,
          quote_amount: updates.quote_amount ?? current.quote_amount,
          deposit_amount: updates.deposit_amount ?? current.deposit_amount,
          payment_token: token,
        }).catch(console.error);
      }
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

export async function resendPaymentEmailAction(id: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };

  const { data: order } = await sb
    .from("woodworking_orders")
    .select(
      "status, payment_token, email, customer_name, product, category, quote_amount, deposit_amount"
    )
    .eq("id", id)
    .single();

  if (!order) return { error: "Order not found" };
  if (!order.email) return { error: "No email address on file" };
  if (order.status !== "approved") return { error: "Order must be approved first" };

  let token = order.payment_token;
  if (!token) {
    token = crypto.randomUUID();
    await sb.from("woodworking_orders").update({ payment_token: token }).eq("id", id);
  }

  try {
    await sendPaymentEmail({
      customer_name: order.customer_name,
      email: order.email,
      product: order.product,
      category: order.category,
      quote_amount: order.quote_amount,
      deposit_amount: order.deposit_amount,
      payment_token: token,
    });
    return { ok: true };
  } catch (e) {
    return { error: String(e) };
  }
}
