"use client";

import { useEffect, useRef, useState } from "react";
import { chargeProduct } from "@/app/actions/checkout";
import { formatPrice } from "@/data/products";

/* ---- Minimal typings for the Square Web Payments SDK (avoids `any`) ---- */
interface SquareTokenizeResult {
  status: string; // "OK" on success
  token?: string;
  errors?: { message: string }[];
}
interface SquareCard {
  attach: (selector: string | HTMLElement) => Promise<void>;
  tokenize: () => Promise<SquareTokenizeResult>;
  destroy?: () => Promise<boolean>;
}
interface SquarePayments {
  card: () => Promise<SquareCard>;
}
interface SquareSdk {
  payments: (appId: string, locationId: string) => SquarePayments;
}
declare global {
  interface Window {
    Square?: SquareSdk;
  }
}

const APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
const SDK_URL =
  process.env.NEXT_PUBLIC_SQUARE_ENV === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";

/** Inject (once) and resolve the global Square SDK. */
function loadSquareSdk(): Promise<SquareSdk> {
  return new Promise((resolve, reject) => {
    if (window.Square) return resolve(window.Square);
    const done = () =>
      window.Square ? resolve(window.Square) : reject(new Error("Square SDK failed to load."));
    const existing = document.querySelector<HTMLScriptElement>("script[data-square-sdk]");
    if (existing) {
      existing.addEventListener("load", done);
      existing.addEventListener("error", () => reject(new Error("Square SDK failed to load.")));
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.dataset.squareSdk = "true";
    script.onload = done;
    script.onerror = () => reject(new Error("Square SDK failed to load."));
    document.head.appendChild(script);
  });
}

type Status = "idle" | "loading" | "ready" | "processing" | "success" | "error";

export function BuyButton({ slug, priceCents }: { slug: string; priceCents: number }) {
  const configured = Boolean(APP_ID && LOCATION_ID);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const containerId = `sq-card-${slug}`;

  // Build the hosted card form once the buyer opens checkout.
  useEffect(() => {
    if (!open || !configured) return;
    const appId = APP_ID;
    const locationId = LOCATION_ID;
    if (!appId || !locationId) return;

    let cancelled = false;

    (async () => {
      try {
        const sdk = await loadSquareSdk();
        if (cancelled) return;
        const payments = sdk.payments(appId, locationId);
        const card = await payments.card();
        if (cancelled) {
          await card.destroy?.();
          return;
        }
        await card.attach(`#${containerId}`);
        cardRef.current = card;
        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setMessage(err instanceof Error ? err.message : "Could not load checkout.");
        }
      }
    })();

    return () => {
      cancelled = true;
      cardRef.current?.destroy?.();
      cardRef.current = null;
    };
  }, [open, configured, containerId]);

  async function handlePay() {
    const card = cardRef.current;
    if (!card) return;
    setStatus("processing");
    setMessage(null);
    try {
      const result = await card.tokenize();
      if (result.status !== "OK" || !result.token) {
        setStatus("ready");
        setMessage(result.errors?.[0]?.message ?? "Please double-check your card details.");
        return;
      }
      const charge = await chargeProduct({
        slug,
        sourceId: result.token,
        idempotencyKey: crypto.randomUUID(),
      });
      if (charge.ok) {
        setStatus("success");
      } else {
        setStatus("ready");
        setMessage(charge.error);
      }
    } catch (err) {
      setStatus("ready");
      setMessage(err instanceof Error ? err.message : "Payment failed. Please try again.");
    }
  }

  const price = formatPrice(priceCents);

  // No public Square keys yet → show a disabled affordance, keep the page working.
  if (!configured) {
    return (
      <div className="rounded-[var(--radius-card)] border border-sand-dark bg-cream-50 p-5">
        <p className="font-serif text-lg font-bold text-walnut">Buy it now — {price}</p>
        <button
          type="button"
          disabled
          className="btn-primary mt-3 w-full cursor-not-allowed opacity-50"
          title="Set NEXT_PUBLIC_SQUARE_APP_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID to enable online checkout"
        >
          Online checkout coming soon
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-wood-dark/40 bg-sand/60 p-5">
        <p className="font-serif text-lg font-bold text-walnut">Payment received — thank you! 🎉</p>
        <p className="mt-1 text-sm text-espresso/80">
          We&apos;ll text you to confirm the details and timing. A receipt is on its way to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-sand-dark bg-cream-50 p-5">
      <p className="font-serif text-lg font-bold text-walnut">Buy it now — {price}</p>

      {!open ? (
        <button
          type="button"
          onClick={() => {
            setMessage(null);
            setStatus("loading");
            setOpen(true);
          }}
          className="btn-primary mt-3 w-full"
        >
          Buy Now
        </button>
      ) : (
        <div className="mt-4">
          {status === "loading" && (
            <p className="text-sm text-espresso/70">Loading secure checkout…</p>
          )}
          {/* Square injects the card fields into this container. */}
          <div id={containerId} className="min-h-[44px]" />

          {message && <p className="mt-2 text-sm font-medium text-red-700">{message}</p>}

          <button
            type="button"
            onClick={handlePay}
            disabled={status !== "ready"}
            className="btn-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "processing" ? "Processing…" : `Pay ${price}`}
          </button>
          <p className="mt-2 text-center text-xs text-espresso/60">
            Secured by Square. Card details never touch our servers.
          </p>
        </div>
      )}
    </div>
  );
}
