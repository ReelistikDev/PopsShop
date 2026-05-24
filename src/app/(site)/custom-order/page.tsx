import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import { OrderForm } from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Custom Order Request",
  description:
    "Tell us about the piece you'd like made. No checkout — we'll text you back to talk details and pricing.",
};

const FALLBACK_CATEGORIES = [
  { slug: "Tables & Furniture", name: "Tables & Furniture" },
  { slug: "Shelves & Storage", name: "Shelves & Storage" },
  { slug: "Signs & Plaques", name: "Signs & Plaques" },
  { slug: "Cutting Boards", name: "Cutting Boards" },
  { slug: "Custom", name: "Something Custom" },
];

async function getCategories() {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return FALLBACK_CATEGORIES;
    const { data } = await sb
      .from("products")
      .select("category")
      .eq("active", true)
      .order("category");
    if (!data?.length) return FALLBACK_CATEGORIES;
    const unique = [...new Set(data.map((r) => r.category as string))];
    return unique.map((c) => ({ slug: c, name: c }));
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

async function getProductName(slug: string) {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return null;
    const { data } = await sb
      .from("products")
      .select("name, category")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function CustomOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; category?: string }>;
}) {
  const { product, category } = await searchParams;

  const [categories, matchedProduct] = await Promise.all([
    getCategories(),
    product ? getProductName(product) : null,
  ]);

  const initialCategory = matchedProduct?.category ?? category ?? "";
  const initialProduct = matchedProduct?.name ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Custom Order</p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
          Let&apos;s build your piece
        </h1>
        <p className="mt-3 text-base leading-relaxed text-espresso/80 sm:text-lg">
          Fill out what you know — even rough details help. The more you share, the better we can
          quote it. Choose to send via WhatsApp or email — your request will be pre-filled and sent
          directly to Lenwood. No payment here.
        </p>
        {matchedProduct && (
          <p className="mt-4 rounded-lg bg-sand/60 px-4 py-2.5 text-sm text-walnut">
            Requesting: <span className="font-semibold">{matchedProduct.name}</span>
          </p>
        )}
      </header>

      <div className="mt-6 rounded-[var(--radius-card)] border border-sand-dark bg-cream p-4 shadow-sm sm:p-7">
        <OrderForm
          categories={categories}
          initialCategory={initialCategory}
          initialProduct={initialProduct}
        />
      </div>
    </div>
  );
}
