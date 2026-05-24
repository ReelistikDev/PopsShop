import type { Metadata } from "next";
import Link from "next/link";
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

function ComingSoonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-dashed border-sand-dark/60 bg-cream-50">
      <div className="card-grain-top w-full shrink-0" />
      <div className="flex aspect-[4/5] items-center justify-center bg-sand/40">
        <svg
          className="h-12 w-12 text-espresso/15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <div className="h-4 w-3/4 rounded bg-espresso/10" />
        <div className="mt-2 h-3 w-full rounded bg-espresso/6" />
        <div className="mt-1 h-3 w-2/3 rounded bg-espresso/6" />
        <div className="mt-3 flex items-center justify-between border-t border-sand-dark/40 pt-3">
          <span className="rounded-full bg-wood/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-wood-dark/60">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
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
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ComingSoonCard key={i} />
            ))}
          </div>
          <div className="mt-10 rounded-[var(--radius-card)] border border-sand-dark/60 bg-sand/30 px-6 py-8 text-center">
            <p className="font-serif text-lg font-bold text-walnut">New pieces arriving soon</p>
            <p className="mt-2 text-sm text-espresso/70">
              We&apos;re finishing up the shop. In the meantime, you can still request any custom
              piece — just tell us what you have in mind.
            </p>
            <Link href="/custom-order" className="btn-primary mt-5 inline-block">
              Request a Custom Piece
            </Link>
          </div>
        </>
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
