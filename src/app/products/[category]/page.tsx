import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_SLUGS,
  getCategory,
  getProductsByCategory,
  isCategorySlug,
} from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

type Params = { category: string };

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Shop" };
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  if (!isCategorySlug(category)) notFound();

  const cat = getCategory(category)!;
  const items = getProductsByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-sm text-espresso/60">
        <Link href="/products" className="hover:text-walnut">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span className="text-walnut">{cat.name}</span>
      </nav>

      <header className="mt-4 max-w-2xl">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">{cat.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-espresso/80">{cat.description}</p>
      </header>

      {items.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-wood-dark/50 bg-cream-50 p-10 text-center">
          <p className="font-serif text-2xl font-bold text-walnut">Made fresh per order</p>
          <p className="mx-auto mt-3 max-w-md text-espresso/75">
            We don&apos;t keep these on the shelf — we build each one to your size, wood, and finish.
            Send us the details and we&apos;ll get started.
          </p>
          <Link
            href={`/custom-order?category=${cat.slug}`}
            className="btn-primary mt-6"
          >
            Request a {cat.name.replace(/s$/, "")}
          </Link>
        </div>
      )}

      <div className="mt-16 rounded-[var(--radius-card)] bg-sand/60 p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-walnut">
          Don&apos;t see exactly what you want?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-espresso/75">
          Every piece is custom. Tell us what you have in mind and we&apos;ll build it.
        </p>
        <Link href={`/custom-order?category=${cat.slug}`} className="btn-outline mt-5">
          Start a Custom Order
        </Link>
      </div>
    </div>
  );
}
