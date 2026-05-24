import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = { title: "Products · Admin" };

async function getProducts() {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsClient products={products} />;
}
