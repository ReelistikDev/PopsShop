import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { FinancesClient } from "./FinancesClient";

export const metadata: Metadata = { title: "Finances · Admin" };

async function getFinancesData() {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return { orders: [], expenses: [] };
    const [ordersRes, expensesRes] = await Promise.all([
      sb
        .from("woodworking_orders")
        .select(
          "id, customer_name, category, product, status, quote_amount, deposit_amount, due_date, created_at"
        )
        .order("created_at", { ascending: false }),
      sb
        .from("expenses")
        .select("id, date, amount, category, description, vendor, order_id, created_at")
        .order("date", { ascending: false }),
    ]);
    return {
      orders: ordersRes.data ?? [],
      expenses: expensesRes.data ?? [],
    };
  } catch {
    return { orders: [], expenses: [] };
  }
}

export default async function FinancesPage() {
  const { orders, expenses } = await getFinancesData();
  return <FinancesClient orders={orders} expenses={expenses} />;
}
