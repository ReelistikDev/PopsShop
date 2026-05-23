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
  /** Buyer's personalization request (name to engrave, team, wording, etc.). */
  personalization?: string;
  /** Optional buyer email for the Square receipt. */
  buyerEmail?: string;
}

/** Square's payment `note` field caps at 500 characters. */
const MAX_NOTE_LEN = 500;

/**
 * Charge a single catalog item.
 *
 * The amount is looked up from the catalog **on the server** by slug, so the
 * browser can never dictate or tamper with the price — it only sends the card token
 * and the personalization text. The personalization rides along on the Square payment
 * note so the shop sees exactly what to make.
 */
export async function chargeProduct(input: ChargeProductInput): Promise<ChargeResult> {
  const product = getProductBySlug(input.slug);
  if (!product) {
    return { ok: false, error: "That item is no longer available." };
  }
  if (!input.sourceId) {
    return { ok: false, error: "Missing card details. Please re-enter your card." };
  }

  const personalization = input.personalization?.trim();
  if (product.personalizationRequired && !personalization) {
    return { ok: false, error: "Please add the personalization details before paying." };
  }

  let note = `${product.name} (${product.slug})`;
  if (personalization) note += ` — Personalization: ${personalization}`;
  if (note.length > MAX_NOTE_LEN) note = `${note.slice(0, MAX_NOTE_LEN - 1)}…`;

  return createCardPayment({
    sourceId: input.sourceId,
    amountCents: product.priceCents, // authoritative price — never from the client
    idempotencyKey: input.idempotencyKey || crypto.randomUUID(),
    referenceId: product.slug,
    note,
    buyerEmail: input.buyerEmail,
  });
}
