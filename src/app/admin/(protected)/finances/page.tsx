import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { FinancesClient } from "./FinancesClient";

export const metadata: Metadata = { title: "Finances · Admin" };

async function getFinancesData() {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("woodworking_orders")
      .select(
        "id, customer_name, category, product, status, quote_amount, deposit_amount, due_date, created_at"
      )
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function FinancesPage() {
  const orders = await getFinancesData();
  return <FinancesClient orders={orders} />;
}
