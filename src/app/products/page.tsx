import type { Metadata } from "next";
import Link from "next/link";
import {
  categories,
  getProductsByCategory,
} from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade tables, shelves, signs, cutting boards, and custom woodwork. Every piece is made to order.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">The Shop</p>
        <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Handmade, made to order</h1>
        <p className="mt-4 text-lg leading-relaxed text-espresso/80">
          Everything here is built by hand when you order it. Browse for inspiration, then send us a
          request and we&apos;ll make yours in the wood and finish you choose.
        </p>
      </header>

      {/* Category quick-nav */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>

      {/* Products grouped by category */}
      <div className="mt-16 space-y-16">
        {categories.map((category) => {
          const items = getProductsByCategory(category.slug);
          return (
            <section key={category.slug} id={category.slug} className="scroll-mt-24">
              <div className="flex items-end justify-between gap-4 border-b border-sand-dark pb-3">
                <div>
                  <h2 className="font-serif text-2xl font-bold sm:text-3xl">{category.name}</h2>
                  <p className="mt-1 text-sm text-espresso/70">{category.tagline}</p>
                </div>
                <Link
                  href={`/products/${category.slug}`}
                  className="shrink-0 text-sm font-semibold text-wood-dark hover:text-walnut"
                >
                  View →
                </Link>
              </div>

              {items.length > 0 ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-wood-dark/50 bg-cream-50 p-8 text-center">
                  <p className="font-serif text-xl font-bold text-walnut">Made fresh per order</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-espresso/75">
                    {category.description}
                  </p>
                  <Link
                    href={`/custom-order?category=${category.slug}`}
                    className="btn-primary mt-5 text-sm"
                  >
                    Request a {category.name.replace(/s$/, "")}
                  </Link>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
