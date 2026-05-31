import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { site } from "@/data/site";
import { ProductCard } from "@/components/ProductCard";

async function getFeaturedProducts() {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("products")
      .select("id, slug, name, category, image_url, alt, blurb, price, stock_type, stock_quantity")
      .eq("active", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

const COMING_SOON_CARDS = [
  { label: "Tables & Furniture", gradient: "from-[#3b2410] via-[#5c3820] to-[#3b2410]" },
  { label: "Shelves & Storage",  gradient: "from-[#2e1c0e] via-[#4a2e1a] to-[#2e1c0e]" },
  { label: "Signs & Plaques",    gradient: "from-[#3f2814] via-[#6b4422] to-[#3f2814]" },
  { label: "Cutting Boards",     gradient: "from-[#2a1a0c] via-[#523416] to-[#2a1a0c]" },
  { label: "Custom Pieces",      gradient: "from-[#341f0f] via-[#5a3a1e] to-[#341f0f]" },
  { label: "And More…",          gradient: "from-[#2d1b0b] via-[#4e301a] to-[#2d1b0b]" },
];

const CATEGORIES = [
  { label: "Tables & Furniture", href: "/products", gradient: "from-[#3b2410] to-[#5c3820]", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { label: "Shelves & Storage",  href: "/products", gradient: "from-[#2e1c0e] to-[#4a2e1a]", icon: "M4 6h16M4 12h16M4 18h16" },
  { label: "Signs & Plaques",    href: "/products", gradient: "from-[#3f2814] to-[#6b4422]", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  { label: "Cutting Boards",     href: "/products", gradient: "from-[#2a1a0c] to-[#523416]", icon: "M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5zM20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5zM3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14zM14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5zM15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5zM8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" },
];

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[56vh] items-center overflow-hidden sm:min-h-[64vh]">
        <div className="absolute inset-0 bg-[#1a1009]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1e14] via-[#1a1009] to-[#0d0603]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Wood grain texture lines */}
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"repeating-linear-gradient(170deg,#c8a06a 0px,transparent 1px,transparent 18px,#c8a06a 19px)"}} />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-xl">
            <p className="eyebrow text-wood">{site.established}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-cream-50 sm:text-5xl md:text-6xl">
              Handmade woodwork,<br className="hidden sm:block" /> built just for you.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-cream-100/90 sm:text-lg">
              {site.tagline}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary">
                Browse the Shop
              </Link>
              <Link
                href="/custom-order"
                className="btn-outline border-cream-100/70 text-cream-50 hover:bg-cream-50 hover:text-walnut"
              >
                Request a Custom Piece
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Craft process strip */}
      <section className="border-y border-sand-dark/40 bg-sand/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-sand-dark/40 px-4 sm:grid-cols-4 sm:px-6">
          {[
            { icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", label: "Designed to Order" },
            { icon: "M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z M3 9l9-7 9 7", label: "Cut By Hand" },
            { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label: "Finished & Sealed" },
            { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: "Camden, SC" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-4 py-5 text-center sm:py-6">
              <svg className="h-6 w-6 text-wood" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon} />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-espresso/70">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-14">
        <p className="eyebrow">Handcrafted in Camden, SC</p>
        <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
          Built by hand, made to last
        </h2>
        <p className="mt-3 text-base leading-relaxed text-espresso/80 sm:text-lg">{site.intro}</p>
      </section>

      {/* Featured gallery — always visible */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14">
        <p className="eyebrow">Fresh From the Bench</p>
        <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">Featured pieces</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length > 0
            ? featured.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))
            : COMING_SOON_CARDS.map(({ label, gradient }) => (
                <div
                  key={label}
                  className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-dark/60 bg-cream-50 shadow-[0_1px_4px_rgba(58,42,29,0.08)]"
                >
                  {/* Image area */}
                  <div className={`relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br ${gradient}`}>
                    {/* Grain overlay */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:"repeating-linear-gradient(165deg,#f6efe2 0px,transparent 1px,transparent 14px,#f6efe2 15px)"}} />
                    <div className="relative flex flex-col items-center gap-3">
                      <svg className="h-10 w-10 text-cream-50/30" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
                      </svg>
                      <span className="rounded-full border border-cream-50/20 bg-cream-50/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-cream-50/60">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  {/* Card footer */}
                  <div className="flex items-center justify-between p-3.5">
                    <div>
                      <div className="h-3.5 w-28 rounded bg-espresso/10" />
                      <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-wood-dark/50">{label}</p>
                    </div>
                    <span className="rounded-full bg-wood/10 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-wood-dark/50">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/products" className="btn-outline">
            Browse all pieces →
          </Link>
        </div>
      </section>

      {/* Browse by category */}
      <section className="bg-sand/40 border-y border-sand-dark/40 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-center">What We Make</p>
          <h2 className="mt-2 text-center font-serif text-2xl font-bold sm:text-3xl">Browse by category</h2>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map(({ label, href, gradient }) => (
              <Link
                key={label}
                href={href}
                className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[var(--radius-card)] text-center transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage:"repeating-linear-gradient(165deg,#f6efe2 0px,transparent 1px,transparent 12px,#f6efe2 13px)"}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="relative flex flex-col items-center gap-2 px-3">
                  <svg className="h-7 w-7 text-cream-50/70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
                  </svg>
                  <span className="font-serif text-sm font-bold leading-tight text-cream-50 sm:text-base">
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-walnut">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl">
            Have something special in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-cream-100/85 sm:text-lg">
            Tell us your dimensions, wood, and finish. Reach us directly via WhatsApp or email —
            no checkout, no pressure.
          </p>
          <Link
            href="/custom-order"
            className="btn-primary mt-6 bg-cream-50 text-walnut hover:bg-cream-100"
          >
            Start Your Custom Order
          </Link>
        </div>
      </section>
    </>
  );
}
