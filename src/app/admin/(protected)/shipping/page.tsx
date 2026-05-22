import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ShippingClient } from "./ShippingClient";

export const metadata: Metadata = { title: "Shipping · Admin" };

async function getShippingOrders() {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("woodworking_orders")
      .select(
        "id, customer_name, phone, email, product, category, status, shipping_status, shipping_carrier, tracking_number, shipping_address, quote_amount, due_date, created_at"
      )
      .in("status", ["approved", "in_progress", "complete", "shipped"])
      .order("due_date", { ascending: true, nullsFirst: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ShippingPage() {
  const orders = await getShippingOrders();
  return <ShippingClient orders={orders} />;
}
