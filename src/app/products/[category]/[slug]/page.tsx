import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getProduct,
  getProductsByCategory,
  products,
} from "@/data/products";
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

  const cat = getCategory(category)!;
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const orderHref = `/custom-order?product=${product.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-sm text-espresso/60">
        <Link href="/products" className="hover:text-walnut">
          Shop
        </Link>
        <span className="px-2">/</span>
        <Link href={`/products/${cat.slug}`} className="hover:text-walnut">
          {cat.name}
        </Link>
        <span className="px-2">/</span>
        <span className="text-walnut">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-sand-dark bg-sand shadow-sm">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <p className="eyebrow">{cat.name}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-espresso/80">{product.blurb}</p>

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
              There&apos;s no checkout — send a request with your details and we&apos;ll text you back
              with pricing and timing.
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
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">More {cat.name}</h2>
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
