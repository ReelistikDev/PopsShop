"use client";

import { useState } from "react";

type Props = {
  slug: string;
  available: boolean;
  isInStock: boolean;
  leadTime?: string | null;
};

export function BuyNowButton({ slug, available, isInStock, leadTime }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!available) {
    return (
      <button
        type="button"
        disabled
        className="btn-primary cursor-not-allowed opacity-60"
      >
        Sold Out
      </button>
    );
  }

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const label = isInStock
    ? loading ? "Starting checkout…" : "Buy Now"
    : loading ? "Starting checkout…" : "Buy & Build";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        className="btn-primary disabled:opacity-60"
      >
        {label}
      </button>
      {!isInStock && leadTime && (
        <p className="text-xs text-espresso/60">Made to order · {leadTime}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
