import Image from "next/image";
import Link from "next/link";

type ProductCardProduct = {
  slug: string;
  name: string;
  category: string;
  image_url?: string | null;
  alt?: string | null;
  blurb?: string | null;
  price?: number | null;
  stock_type?: "in_stock" | "made_to_order" | null;
  stock_quantity?: number | null;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const soldOut =
    product.stock_type === "in_stock" && (product.stock_quantity ?? 0) <= 0;
  const inStock =
    product.stock_type === "in_stock" && (product.stock_quantity ?? 0) > 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-dark/80 bg-cream-50 shadow-[0_1px_4px_rgba(58,42,29,0.08),0_4px_16px_rgba(58,42,29,0.1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(58,42,29,0.18)]"
    >
      {/* Wood grain accent strip */}
      <div className="card-grain-top w-full shrink-0" />

      <div className="relative aspect-[4/5] overflow-hidden bg-sand ring-1 ring-inset ring-black/5">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain saturate-[0.96] transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-espresso/20">
            <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bark/15 to-transparent" />
        {soldOut && (
          <span className="absolute left-2 top-2 rounded-full bg-red-700/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white shadow">
            Sold Out
          </span>
        )}
        {inStock && (
          <span className="absolute left-2 top-2 rounded-full bg-green-700/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white shadow">
            In Stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="font-serif text-base font-bold leading-snug text-walnut">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-espresso/75 line-clamp-3">
          {product.blurb}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-sand-dark/50 pt-3">
          <div>
            {product.price != null ? (
              <span className="text-sm font-bold text-walnut">
                From ${product.price.toLocaleString()}
              </span>
            ) : (
              <span className="text-[0.68rem] font-bold uppercase tracking-widest text-wood-dark">
                Request this piece
              </span>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-wood transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
