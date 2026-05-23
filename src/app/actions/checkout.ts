"use server";

import { getProductBySlug } from "@/data/products";
import { createCardPayment } from "@/lib/square";

export type ChargeResult =
  | { ok: true; paymentId: string }
  | { ok: false; error: string };

export interface ChargeProductInput {
  /** Catalog slug of the piece being purchased. */
  slug: string;
  /** Card token from the Web Payments SDK (`card.tokenize()`). */
  sourceId: string;
  /** Unique per attempt — generated client-side, makes retries idempotent. */
  idempotencyKey: string;
  /** Optional buyer email for the Square receipt. */
  buyerEmail?: string;
}

/**
 * Charge a single catalog item.
 *
 * The amount is looked up from the catalog **on the server** by slug, so the
 * browser can never dictate or tamper with the price — it only sends the card token.
 */
export async function chargeProduct(input: ChargeProductInput): Promise<ChargeResult> {
  const product = getProductBySlug(input.slug);
  if (!product) {
    return { ok: false, error: "That item is no longer available." };
  }
  if (!input.sourceId) {
    return { ok: false, error: "Missing card details. Please re-enter your card." };
  }

  return createCardPayment({
    sourceId: input.sourceId,
    amountCents: product.priceCents, // authoritative price — never from the client
    idempotencyKey: input.idempotencyKey || crypto.randomUUID(),
    referenceId: product.slug,
    note: `${product.name} (${product.slug})`,
    buyerEmail: input.buyerEmail,
  });
}
