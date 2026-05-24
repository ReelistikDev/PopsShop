"use client";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";

type Order = {
  id: string;
  customer_name: string;
  product: string | null;
  category: string | null;
  quote_amount: number | null;
  deposit_amount: number | null;
  payment_status: string;
  payment_token: string;
};

declare global {
  interface Window {
    Square?: {
      payments(appId: string, locationId: string): Promise<{
        card(): Promise<{
          attach(selector: string): Promise<void>;
          tokenize(): Promise<{ status: string; token?: string }>;
        }>;
      }>;
    };
  }
}

const SQ_APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? "";
const SQ_LOCATION = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
const SQ_ENV = process.env.NEXT_PUBLIC_SQUARE_ENV ?? "sandbox";
const SQ_SCRIPT =
  SQ_ENV === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";

export function PaymentForm({ order }: { order: Order }) {
  const [sqReady, setSqReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [paymentType, setPaymentType] = useState<"deposit" | "paid">(
    order.deposit_amount ? "deposit" : "paid"
  );
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const cardRef = useRef<{ tokenize(): Promise<{ status: string; token?: string }> } | null>(null);

  // Already fully paid
  const alreadyPaid = order.payment_status === "paid";
  const hasDeposit = order.payment_status === "deposit";
  const canPayFullOnly = hasDeposit && order.quote_amount && order.deposit_amount;

  useEffect(() => {
    if (!sqReady || !SQ_APP_ID || !SQ_LOCATION) return;
    let mounted = true;
    async function init() {
      try {
        const payments = await window.Square!.payments(SQ_APP_ID, SQ_LOCATION);
        const card = await payments.card();
        await card.attach("#sq-card");
        if (mounted) {
          cardRef.current = card;
          setCardReady(true);
        }
      } catch (e) {
        console.error("Square init error:", e);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [sqReady]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cardRef.current) return;
    setStatus("processing");
    setErrorMsg("");

    const result = await cardRef.current.tokenize();
    if (result.status !== "OK" || !result.token) {
      setErrorMsg("Card error — please check your details and try again.");
      setStatus("error");
      return;
    }

    const res = await fetch("/api/square/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceId: result.token,
        token: order.payment_token,
        paymentType,
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (data.error) {
      setErrorMsg(data.error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  const selectedAmount =
    paymentType === "deposit" ? order.deposit_amount : order.quote_amount;

  if (alreadyPaid) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-2 font-bold text-green-800">Paid in full</p>
        <p className="mt-1 text-sm text-green-700">This order has already been paid. Thank you!</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-3xl">✓</p>
        <p className="mt-3 text-xl font-bold text-green-800">Payment received!</p>
        <p className="mt-2 text-sm text-green-700">
          {paymentType === "deposit"
            ? "Your deposit has been received. We'll be in touch when your piece is ready."
            : "Your order is paid in full. We'll be in touch soon!"}
        </p>
      </div>
    );
  }

  return (
    <>
      <Script src={SQ_SCRIPT} strategy="afterInteractive" onLoad={() => setSqReady(true)} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Payment type selector */}
        {order.deposit_amount && order.quote_amount && !canPayFullOnly && (
          <div className="rounded-2xl border border-[#e8dcc8] bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              How much would you like to pay?
            </p>
            <div className="space-y-2">
              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                  paymentType === "deposit"
                    ? "border-[#8a5a32] bg-[#8a5a32]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentType"
                    value="deposit"
                    checked={paymentType === "deposit"}
                    onChange={() => setPaymentType("deposit")}
                    className="accent-[#8a5a32]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Pay Deposit</p>
                    <p className="text-xs text-gray-400">Balance due on completion</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-[#8a5a32]">
                  ${order.deposit_amount.toLocaleString()}
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                  paymentType === "paid"
                    ? "border-[#8a5a32] bg-[#8a5a32]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentType"
                    value="paid"
                    checked={paymentType === "paid"}
                    onChange={() => setPaymentType("paid")}
                    className="accent-[#8a5a32]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Pay in Full</p>
                    <p className="text-xs text-gray-400">Complete payment upfront</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-[#8a5a32]">
                  ${order.quote_amount.toLocaleString()}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Remaining balance for deposit-paid orders */}
        {canPayFullOnly && order.quote_amount && order.deposit_amount && (
          <div className="rounded-2xl border border-[#e8dcc8] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Remaining Balance
            </p>
            <p className="mt-1 text-2xl font-bold text-[#8a5a32]">
              ${(order.quote_amount - order.deposit_amount).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              Deposit of ${order.deposit_amount.toLocaleString()} already received
            </p>
          </div>
        )}

        {/* Square card form */}
        <div className="rounded-2xl border border-[#e8dcc8] bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Card Details
          </p>
          <div
            id="sq-card"
            className="min-h-[100px]"
          >
            {!cardReady && (
              <div className="flex h-24 items-center justify-center text-sm text-gray-400">
                Loading payment form…
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={!cardReady || status === "processing"}
          className="w-full rounded-xl bg-[#8a5a32] py-4 text-base font-bold text-white transition hover:bg-[#7a4f2c] disabled:opacity-50"
        >
          {status === "processing"
            ? "Processing…"
            : `Pay ${selectedAmount ? `$${selectedAmount.toLocaleString()}` : ""}`}
        </button>

        <p className="text-center text-xs text-gray-400">
          Secured by Square. We never see your card details.
        </p>
      </form>
    </>
  );
}
