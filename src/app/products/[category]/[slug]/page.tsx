import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

type Params = { category: string; slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return { title: "Shop" };
  return {
    title: product.name,
    description: product.blurb,
    openGraph: { images: [{ url: product.image }] },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const orderHref = `/custom-order?product=${product.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="text-sm text-espresso/60">
        <Link href="/products" className="hover:text-walnut">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span className="text-walnut">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[9/10] overflow-hidden rounded-[var(--radius-card)] border border-sand-dark bg-sand shadow-[0_4px_20px_rgba(58,42,29,0.15)]">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        {/* Details */}
        <div>
          <p className="eyebrow">Made to Order</p>
          <h1 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-base leading-relaxed text-espresso/80 sm:text-lg">{product.blurb}</p>

          {product.details && (
            <dl className="mt-6 space-y-3 rounded-[var(--radius-card)] bg-cream-50 p-5">
              {product.details.sizeNote && (
                <Spec label="Size" value={product.details.sizeNote} />
              )}
              {product.details.woodNote && (
                <Spec label="Wood" value={product.details.woodNote} />
              )}
              {product.details.finishNote && (
                <Spec label="Finish" value={product.details.finishNote} />
              )}
            </dl>
          )}

          <div className="mt-7 rounded-[var(--radius-card)] border border-wood-dark/30 bg-sand/50 p-5">
            <p className="font-serif text-lg font-bold text-walnut">Made to order</p>
            <p className="mt-1 text-sm text-espresso/75">
              There&apos;s no checkout — send a request and we&apos;ll reach you via WhatsApp or email
              to talk through pricing and timing.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href={orderHref} className="btn-primary">
                Request This Piece
              </Link>
              <Link href="/custom-order" className="btn-outline">
                Start From Scratch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <h2 className="font-serif text-xl font-bold sm:text-2xl">More Handmade Pieces</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="w-16 shrink-0 font-semibold uppercase tracking-wide text-wood-dark">
        {label}
      </dt>
      <dd className="text-espresso/80">{value}</dd>
    </div>
  );
}
