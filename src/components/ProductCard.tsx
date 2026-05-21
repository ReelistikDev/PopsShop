import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.category}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-dark/70 bg-cream-50 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[9/10] overflow-hidden bg-sand">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain saturate-[0.96] transition-transform duration-300 group-hover:scale-105"
        />
        {/* Subtle grounding only — the product photos share a rustic backdrop, so keep the piece bright. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bark/15 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-bold text-walnut">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-espresso/75">
          {product.blurb}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-wood-dark">
          Request this piece
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
