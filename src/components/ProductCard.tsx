import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.category}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-dark/80 bg-cream-50 shadow-[0_1px_4px_rgba(58,42,29,0.08),0_4px_16px_rgba(58,42,29,0.1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(58,42,29,0.18)]"
    >
      {/* Wood grain accent strip */}
      <div className="card-grain-top w-full shrink-0" />

      <div className="relative aspect-[4/5] overflow-hidden bg-sand ring-1 ring-inset ring-black/5">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain saturate-[0.96] transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bark/15 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="font-serif text-base font-bold leading-snug text-walnut">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-espresso/75 line-clamp-3">
          {product.blurb}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-sand-dark/50 pt-3">
          <span className="text-[0.68rem] font-bold uppercase tracking-widest text-wood-dark">
            Request this piece
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-wood transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
