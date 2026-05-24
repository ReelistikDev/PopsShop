"use server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export type ExpensePayload = {
  date: string;
  amount: number;
  category: string;
  description: string | null;
  vendor: string | null;
  order_id: string | null;
};

export async function addExpenseAction(data: ExpensePayload) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const { error } = await sb.from("expenses").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/admin/finances");
  return { ok: true };
}

export async function updateExpenseAction(id: string, data: ExpensePayload) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const { error } = await sb.from("expenses").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/finances");
  return { ok: true };
}

export async function deleteExpenseAction(id: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const { error } = await sb.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/finances");
  return { ok: true };
}
