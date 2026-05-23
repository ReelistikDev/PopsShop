import { SquareClient, SquareEnvironment, SquareError } from "square";

/**
 * Server-side Square payments helper (Square SDK v44, the modern `SquareClient` API).
 *
 * Reads credentials from the environment and charges a card token (the `sourceId`
 * produced by the Web Payments SDK in the browser). Like the Twilio helper, this
 * never throws — it returns a result so the caller can react gracefully.
 *
 * Required env vars (server-only — never prefixed NEXT_PUBLIC_):
 *   SQUARE_ACCESS_TOKEN   — access token for the Square application
 *   SQUARE_LOCATION_ID    — location to attribute the payment to
 *   SQUARE_ENV            — "sandbox" (default) or "production"
 */

export type PaymentResult =
  | { ok: true; paymentId: string; status?: string }
  | { ok: false; error: string };

export interface CardPaymentInput {
  /** Single-use card token from Square Web Payments SDK `card.tokenize()`. */
  sourceId: string;
  /** Charge amount in the currency's smallest unit (USD cents). */
  amountCents: number;
  /** Unique per payment attempt — makes retries safe. */
  idempotencyKey: string;
  /** Optional: your own reference (e.g. product slug) shown in the Square dashboard. */
  referenceId?: string;
  /** Optional note shown on the payment. */
  note?: string;
  /** Optional buyer email for the receipt. */
  buyerEmail?: string;
}

function getClient(): { client: SquareClient; locationId: string } | null {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!token || !locationId) return null;

  const environment =
    process.env.SQUARE_ENV?.toLowerCase() === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox;

  return { client: new SquareClient({ token, environment }), locationId };
}

/** True when the server has enough config to take a payment. */
export function isSquareConfigured(): boolean {
  return getClient() !== null;
}

export async function createCardPayment(input: CardPaymentInput): Promise<PaymentResult> {
  const cfg = getClient();
  if (!cfg) {
    return { ok: false, error: "Online payments are not configured (missing Square env vars)." };
  }

  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    return { ok: false, error: "Invalid payment amount." };
  }

  try {
    const resp = await cfg.client.payments.create({
      sourceId: input.sourceId,
      idempotencyKey: input.idempotencyKey,
      amountMoney: { amount: BigInt(input.amountCents), currency: "USD" },
      locationId: cfg.locationId,
      referenceId: input.referenceId,
      note: input.note,
      buyerEmailAddress: input.buyerEmail,
    });

    const payment = resp.payment;
    if (!payment?.id) {
      return { ok: false, error: "Payment did not complete. Please try again." };
    }
    return { ok: true, paymentId: payment.id, status: payment.status };
  } catch (err) {
    // Square surfaces structured, buyer-safe messages in err.errors[].detail.
    if (err instanceof SquareError) {
      const detail = err.body && Array.isArray((err.body as { errors?: { detail?: string }[] }).errors)
        ? (err.body as { errors?: { detail?: string }[] }).errors?.[0]?.detail
        : undefined;
      return { ok: false, error: detail || err.message || "Card was declined." };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown payment error.",
    };
  }
}
