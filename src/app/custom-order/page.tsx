import type { Metadata } from "next";
import { categories, getProductBySlug, isCategorySlug } from "@/data/products";
import { OrderForm } from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Custom Order Request",
  description:
    "Tell us about the piece you'd like made. No checkout — we'll text you back to talk details and pricing.",
};

export default async function CustomOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; category?: string }>;
}) {
  const { product, category } = await searchParams;

  const matchedProduct = product ? getProductBySlug(product) : undefined;
  const initialCategory = matchedProduct
    ? matchedProduct.category
    : category && isCategorySlug(category)
      ? category
      : "";
  const initialProduct = matchedProduct?.name ?? "";

  const categoryOptions = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow">Custom Order</p>
        <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
          Let&apos;s build your piece
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-espresso/80">
          Fill out what you know — even rough details help. The more you share, the better we can
          quote it. We&apos;ll send you a text to talk it through. There&apos;s no payment here.
        </p>
        {matchedProduct && (
          <p className="mt-4 rounded-lg bg-sand/60 px-4 py-2.5 text-sm text-walnut">
            Requesting: <span className="font-semibold">{matchedProduct.name}</span>
          </p>
        )}
      </header>

      <div className="mt-10 rounded-[var(--radius-card)] border border-sand-dark bg-cream p-5 shadow-sm sm:p-8">
        <OrderForm
          categories={categoryOptions}
          initialCategory={initialCategory}
          initialProduct={initialProduct}
        />
      </div>
    </div>
  );
}
