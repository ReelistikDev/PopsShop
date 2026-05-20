import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/products";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-sand-dark/70 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        // Made-to-order fallback (no catalog photo yet) — warm wood gradient.
        <div className="absolute inset-0 bg-gradient-to-br from-wood via-wood-dark to-walnut">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.25">
              <rect x="3" y="8" width="18" height="9" rx="2" />
              <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
        </div>
      )}

      {/* Readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/25 to-transparent" />

      <div className="relative p-4">
        {!category.image && (
          <span className="mb-1 inline-block rounded-full bg-cream-50/90 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-walnut">
            Made to order
          </span>
        )}
        <h3 className="font-serif text-xl font-bold text-cream-50">{category.name}</h3>
        <p className="mt-0.5 text-sm text-cream-100/85">{category.tagline}</p>
      </div>
    </Link>
  );
}
