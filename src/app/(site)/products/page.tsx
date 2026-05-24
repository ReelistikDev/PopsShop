import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade tables, shelves, signs, and custom woodwork. Every piece is made to order.",
};

async function getProducts() {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("products")
      .select("id, slug, name, category, image_url, alt, blurb")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">The Shop</p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Handmade, made to order</h1>
        <p className="mt-3 text-base leading-relaxed text-espresso/80 sm:text-lg">
          Everything here is built by hand when you order it. Browse for inspiration, then send us a
          request and we&apos;ll make yours in the wood and finish you choose.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="mt-12 text-center text-espresso/60">
          <p className="text-lg font-medium">New pieces coming soon.</p>
          <p className="mt-1 text-sm">Check back shortly — or request a custom piece today.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
