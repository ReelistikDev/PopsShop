import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request Received",
  description: "Thanks for your custom order request.",
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;
  const firstName = (name ?? "").trim();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage/20 text-sage-dark">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="mt-7 font-serif text-4xl font-bold sm:text-5xl">
        {firstName ? `Thank you, ${firstName}!` : "Request received!"}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-espresso/80">
        Your request is in the shop. We&apos;ve been notified and will{" "}
        <span className="font-semibold text-walnut">text you back soon</span> to talk through the
        details, timing, and pricing.
      </p>

      <div className="mt-8 w-full rounded-[var(--radius-card)] border border-sand-dark bg-cream-50 p-6 text-left">
        <h2 className="font-serif text-xl font-bold text-walnut">What happens next</h2>
        <ol className="mt-3 space-y-2 text-sm text-espresso/80">
          <li className="flex gap-3">
            <Step n={1} /> We review your request here in the workshop.
          </li>
          <li className="flex gap-3">
            <Step n={2} /> We text you to confirm details and a price.
          </li>
          <li className="flex gap-3">
            <Step n={3} /> Once you approve, we start building your piece by hand.
          </li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className="btn-primary">
          Keep Browsing
        </Link>
        <Link href="/" className="btn-outline">
          Back Home
        </Link>
      </div>
    </div>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wood-dark text-xs font-bold text-cream-50">
      {n}
    </span>
  );
}
