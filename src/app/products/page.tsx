import type { Metadata } from "next";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade tables, shelves, signs, and custom woodwork. Every piece is made to order.",
};

export default function ProductsPage() {
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

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
