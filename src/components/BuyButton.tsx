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

export interface BuyButtonProps {
  slug: string;
  priceCents: number;
  /** Prompt for the personalization field; when set, the field is shown. */
  personalizationPrompt?: string;
  /** When true, the buyer must fill personalization before paying. */
  personalizationRequired?: boolean;
}

export function BuyButton({
  slug,
  priceCents,
  personalizationPrompt,
  personalizationRequired = false,
}: BuyButtonProps) {
  const configured = Boolean(APP_ID && LOCATION_ID);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const cardRef = useRef<SquareCard | null>(null);
  const containerId = `sq-card-${slug}`;

  const showNote = Boolean(personalizationPrompt);
  const noteMissing = personalizationRequired && note.trim() === "";

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

  function handleBuyNow() {
    if (noteMissing) {
      setMessage("Please add the personalization details above first.");
      return;
    }
    setMessage(null);
    setStatus("loading");
    setOpen(true);
  }

  async function handlePay() {
    const card = cardRef.current;
    if (!card) return;
    if (noteMissing) {
      setMessage("Please add the personalization details above first.");
      return;
    }
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
        personalization: note.trim() || undefined,
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

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-wood-dark/40 bg-sand/60 p-5">
        <p className="font-serif text-lg font-bold text-walnut">Payment received — thank you! 🎉</p>
        <p className="mt-1 text-sm text-espresso/80">
          We&apos;ll get started on your piece and reach out to confirm the details. A receipt is on
          its way to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-sand-dark bg-cream-50 p-5">
      <p className="font-serif text-lg font-bold text-walnut">Buy it now — {price}</p>

      {showNote && (
        <div className="mt-3">
          <label
            htmlFor={`note-${slug}`}
            className="block text-sm font-semibold text-walnut"
          >
            Personalization
            {personalizationRequired && <span className="text-wood-dark"> *</span>}
          </label>
          <textarea
            id={`note-${slug}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={status === "processing"}
            rows={2}
            maxLength={400}
            placeholder={personalizationPrompt}
            className="mt-1 w-full rounded-[var(--radius-card)] border border-sand-dark bg-white px-3 py-2 text-sm text-espresso shadow-inner outline-none placeholder:text-espresso/45 focus:border-wood-dark"
          />
          <p className="mt-1 text-xs text-espresso/60">
            Tell us how to make it yours — we&apos;ll build to this note.
          </p>
        </div>
      )}

      {!configured ? (
        // No public Square keys yet → keep the page working, show the field above.
        <button
          type="button"
          disabled
          className="btn-primary mt-3 w-full cursor-not-allowed opacity-50"
          title="Set NEXT_PUBLIC_SQUARE_APP_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID to enable online checkout"
        >
          Online checkout coming soon
        </button>
      ) : !open ? (
        <button type="button" onClick={handleBuyNow} className="btn-primary mt-3 w-full">
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

      {!open && message && <p className="mt-2 text-sm font-medium text-red-700">{message}</p>}
    </div>
  );
}
