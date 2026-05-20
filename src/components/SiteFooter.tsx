import Link from "next/link";
import { categories } from "@/data/products";
import { site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-walnut/20 bg-bark text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl font-bold text-cream-50">{site.name}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-100/80">
            {site.tagline}
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-wood">
            {site.established} · {site.location}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-wood">
            Shop by Category
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products/${c.slug}`}
                  className="text-cream-100/80 transition-colors hover:text-cream-50"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-wood">
            Get in Touch
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-cream-100/80">
            Ready to start a piece? Send us the details and we&apos;ll text you back to talk it through.
          </p>
          <Link href="/custom-order" className="btn-primary mt-4 text-sm">
            Request a Custom Piece
          </Link>
          {site.displayPhone ? (
            <p className="mt-4 text-sm text-cream-100/80">{site.displayPhone}</p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-cream-100/60 sm:px-6">
          © {year} {site.name}. Handmade with care.
        </div>
      </div>
    </footer>
  );
}
