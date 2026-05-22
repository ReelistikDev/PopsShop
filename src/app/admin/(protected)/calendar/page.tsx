import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CalendarClient } from "./CalendarClient";

export const metadata: Metadata = { title: "Calendar · Admin" };

type CalOrder = {
  id: string;
  customer_name: string;
  product: string | null;
  category: string | null;
  status: string;
  due_date: string;
};

async function getOrdersWithDueDates(): Promise<CalOrder[]> {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("woodworking_orders")
      .select("id, customer_name, product, category, status, due_date")
      .not("due_date", "is", null)
      .order("due_date", { ascending: true });
    return (data ?? []) as CalOrder[];
  } catch {
    return [];
  }
}

export default async function CalendarPage() {
  const orders = await getOrdersWithDueDates();
  return <CalendarClient orders={orders} />;
}
