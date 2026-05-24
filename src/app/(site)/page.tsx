import Image from "next/image";
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
      .select("id, slug, name, category, image_url, alt, blurb")
      .eq("active", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[50vh] items-center overflow-hidden sm:min-h-[58vh]">
        <Image
          src="/images/products/tables-console-table.jpg"
          alt="A handcrafted farmhouse console table styled in the home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-bark/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/95 via-bark/75 to-bark/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-xl">
            <p className="eyebrow text-wood">{site.established}</p>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream-50 sm:text-5xl md:text-6xl">
              Handmade woodwork, built just for you.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-cream-100/90 sm:text-lg">
              {site.tagline}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-14">
        <p className="eyebrow">Handcrafted in Camden, SC</p>
        <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
          Built by hand, made to last
        </h2>
        <p className="mt-3 text-base leading-relaxed text-espresso/80 sm:text-lg">{site.intro}</p>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="eyebrow">Fresh From the Bench</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">Featured pieces</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/products" className="btn-outline">
              Browse all pieces →
            </Link>
          </div>
        </section>
      )}

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
