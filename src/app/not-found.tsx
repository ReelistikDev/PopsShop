import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
        This piece isn&apos;t on the shelf
      </h1>
      <p className="mt-4 text-lg text-espresso/80">
        We couldn&apos;t find that page. Let&apos;s get you back to the good stuff.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className="btn-primary">
          Browse the Shop
        </Link>
        <Link href="/" className="btn-outline">
          Back Home
        </Link>
      </div>
    </div>
  );
}
