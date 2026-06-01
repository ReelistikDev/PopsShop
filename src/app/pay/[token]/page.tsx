import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { site } from "@/data/site";
import { PaymentForm } from "./PaymentForm";

export const metadata: Metadata = { title: `Make Payment · ${site.name}` };

async function getOrderByToken(token: string) {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return null;
    const { data } = await sb
      .from("woodworking_orders")
      .select(
        "id, customer_name, product, category, quote_amount, deposit_amount, payment_status, payment_token"
      )
      .eq("payment_token", token)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-[#f6efe2] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1009] px-6 py-4">
        <p className="font-serif text-lg font-bold text-[#f6efe2]">{site.name}</p>
        <p className="text-xs text-[#d8c3a2]">Handmade, Made-to-Order Woodwork · Camden, SC</p>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          {/* Order summary */}
          <div className="rounded-2xl border border-[#e8dcc8] bg-white p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8a5a32]">
              Your Order
            </p>
            <p className="text-xl font-bold text-[#1a1009]">{order.customer_name}</p>
            <p className="text-sm text-gray-500">
              {order.product || order.category || "Custom piece"}
            </p>
            {order.quote_amount && (
              <p className="mt-3 text-2xl font-bold text-[#8a5a32]">
                ${order.quote_amount.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-gray-400">total</span>
              </p>
            )}
          </div>

          <PaymentForm order={order} />
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-gray-400">
        Payments secured by Square &mdash; your card info never touches our server
      </footer>
    </div>
  );
}
