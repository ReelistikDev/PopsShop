import Image from "next/image";
import Link from "next/link";
import { categories, getFeaturedProducts } from "@/data/products";
import { site } from "@/data/site";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[56vh] items-center overflow-hidden sm:min-h-[62vh]">
        <Image
          src="/images/products/tables-console-table.jpg"
          alt="A handcrafted farmhouse console table styled in the home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        {/* Even darkening so the busy workshop background recedes, then a
            left-weighted gradient for headline contrast and a base to ground it. */}
        <div className="absolute inset-0 bg-bark/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-bark/95 via-bark/75 to-bark/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-bark/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-xl">
            <p className="eyebrow text-wood">{site.established}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-cream-50 sm:text-5xl md:text-6xl">
              Handmade woodwork, built just for you.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-cream-100/90">
              {site.tagline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="eyebrow">Our Family Workshop</p>
        <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
          Three generations of sawdust and craft
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-espresso/80">{site.intro}</p>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">What We Make</p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Shop by category</h2>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 text-sm font-semibold text-wood-dark hover:text-walnut sm:inline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow">Fresh From the Bench</p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Featured pieces</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-walnut">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-cream-50 sm:text-4xl">
            Have something special in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream-100/85">
            Tell us your dimensions, wood, and finish. We&apos;ll text you back to talk through the
            details and price — no checkout, no pressure.
          </p>
          <Link
            href="/custom-order"
            className="btn-primary mt-8 bg-cream-50 text-walnut hover:bg-cream-100"
          >
            Start Your Custom Order
          </Link>
        </div>
      </section>
    </>
  );
}
