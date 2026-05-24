import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

async function getProduct(slug: string) {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return null;
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getRelated(slug: string, category: string) {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("products")
      .select("id, slug, name, category, image_url, alt, blurb")
      .eq("active", true)
      .eq("category", category)
      .neq("slug", slug)
      .limit(3);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product Not Found" };
  return {
    title: p.name,
    description: p.blurb ?? `Handmade ${p.name} — made to order in Camden, SC.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(slug, product.category);
  const hasSpecs = product.size_note || product.wood_note || product.finish_note;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-sand-dark/60 bg-sand">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.alt ?? product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain saturate-[0.96]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-espresso/20">
              <svg className="h-24 w-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-2 font-serif text-2xl font-bold leading-snug text-walnut sm:text-3xl">
            {product.name}
          </h1>
          {product.blurb && (
            <p className="mt-3 text-base leading-relaxed text-espresso/80">{product.blurb}</p>
          )}

          {hasSpecs && (
            <div className="mt-5 rounded-xl border border-sand-dark/60 bg-sand/50 p-4 text-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-espresso/50">
                Specs
              </p>
              <dl className="space-y-1.5">
                {product.size_note && (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-espresso/70">Size</dt>
                    <dd className="text-espresso/80">{product.size_note}</dd>
                  </div>
                )}
                {product.wood_note && (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-espresso/70">Wood</dt>
                    <dd className="text-espresso/80">{product.wood_note}</dd>
                  </div>
                )}
                {product.finish_note && (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-espresso/70">Finish</dt>
                    <dd className="text-espresso/80">{product.finish_note}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-sand-dark/60 bg-cream-50 p-4 text-sm text-espresso/70">
            <p className="font-semibold text-espresso/90">Made to order</p>
            <p className="mt-1">
              This piece is built when you request it — in your dimensions, wood, and finish.
              No checkout here; reach us directly to talk details and pricing.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/custom-order?product=${product.slug}&category=${encodeURIComponent(product.category)}`}
              className="btn-primary"
            >
              Request This Piece
            </Link>
            <Link href="/custom-order" className="btn-outline">
              Start From Scratch
            </Link>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-xl font-bold text-walnut">More in {product.category}</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/products/${r.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-dark/80 bg-cream-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  {r.image_url ? (
                    <Image
                      src={r.image_url}
                      alt={r.alt ?? r.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-espresso/20">
                      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-serif font-bold text-walnut">{r.name}</p>
                  {r.blurb && <p className="mt-1 text-xs text-espresso/70 line-clamp-2">{r.blurb}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
