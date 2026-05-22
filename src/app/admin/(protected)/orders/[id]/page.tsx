import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { OrderDetailForm } from "./OrderDetailForm";

export const metadata: Metadata = { title: "Order Detail · Admin" };

async function getOrder(id: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data } = await sb
    .from("woodworking_orders")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/orders" className="hover:text-[#8a5a32]">
          Orders
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-800">{order.customer_name}</span>
      </div>
      <OrderDetailForm order={order} />
    </div>
  );
}
