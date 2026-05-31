import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Thanks for your order",
  description: "Your purchase has been received.",
};

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="eyebrow">Order Received</p>
      <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Thanks for your order!</h1>
      <p className="mt-4 text-base leading-relaxed text-espresso/80 sm:text-lg">
        Your payment went through. You&apos;ll receive a confirmation email from Square shortly with
        your receipt and order details.
      </p>

      <div className="mt-8 rounded-[var(--radius-card)] border border-sand-dark/60 bg-sand/40 p-5 text-left text-sm text-espresso/80">
        <p className="font-semibold text-walnut">What happens next</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>For in-stock items, we&apos;ll pack and ship as soon as possible.</li>
          <li>For made-to-order pieces, we&apos;ll be in touch to confirm details and lead time.</li>
          <li>
            Questions? Reach Lenwood at{" "}
            <a href={`mailto:${site.contactEmail}`} className="font-semibold text-wood-dark hover:underline">
              {site.contactEmail}
            </a>{" "}
            or{" "}
            <a href={`tel:${site.displayPhone}`} className="font-semibold text-wood-dark hover:underline">
              {site.displayPhone}
            </a>
            .
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
