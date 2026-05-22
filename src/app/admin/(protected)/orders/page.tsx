import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { OrdersClient } from "./OrdersClient";

export const metadata: Metadata = { title: "Orders · Admin" };

async function getAllOrders() {
  const sb = getSupabaseAdmin();
  if (!sb) return [];
  const { data } = await sb
    .from("woodworking_orders")
    .select(
      "id, customer_name, phone, email, category, product, status, quote_amount, deposit_amount, due_date, created_at, budget, notes, dimensions, wood_type, finish, quantity, admin_notes"
    )
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const orders = await getAllOrders();
  return (
    <OrdersClient
      orders={orders}
      initialStatus={status ?? ""}
      initialQ={q ?? ""}
    />
  );
}
