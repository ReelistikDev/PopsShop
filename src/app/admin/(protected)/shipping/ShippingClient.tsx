"use client";
import Link from "next/link";
import { useState, useMemo } from "react";

type ShipOrder = Record<string, unknown>;

const SHIP_STATUS_COLOR: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  ready: "bg-yellow-100 text-yellow-800",
  in_transit: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};
const SHIP_STATUS_LABEL: Record<string, string> = {
  pending: "Not Shipped",
  ready: "Ready to Ship",
  in_transit: "In Transit",
  delivered: "Delivered",
};

export function ShippingClient({ orders }: { orders: ShipOrder[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "needs_shipping")
      return orders.filter(
        (o) =>
          String(o.shipping_status ?? "pending") === "pending" ||
          String(o.shipping_status ?? "pending") === "ready"
      );
    return orders.filter(
      (o) => String(o.shipping_status ?? "pending") === filter
    );
  }, [orders, filter]);

  const needsShipping = orders.filter(
    (o) =>
      String(o.shipping_status ?? "pending") === "pending" ||
      String(o.shipping_status ?? "pending") === "ready"
  ).length;
  const inTransit = orders.filter(
    (o) => String(o.shipping_status ?? "") === "in_transit"
  ).length;
  const delivered = orders.filter(
    (o) => String(o.shipping_status ?? "") === "delivered"
  ).length;

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Shipping</h1>
        <p className="text-sm text-gray-500">Active and recent orders requiring shipment</p>
      </div>

      {/* Filter cards */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <FilterCard
          label="Needs Shipping"
          count={needsShipping}
          active={filter === "needs_shipping"}
          onClick={() => setFilter(filter === "needs_shipping" ? "all" : "needs_shipping")}
          color="text-yellow-700 bg-yellow-50 border-yellow-200"
        />
        <FilterCard
          label="In Transit"
          count={inTransit}
          active={filter === "in_transit"}
          onClick={() => setFilter(filter === "in_transit" ? "all" : "in_transit")}
          color="text-blue-700 bg-blue-50 border-blue-200"
        />
        <FilterCard
          label="Delivered"
          count={delivered}
          active={filter === "delivered"}
          onClick={() => setFilter(filter === "delivered" ? "all" : "delivered")}
          color="text-green-700 bg-green-50 border-green-200"
        />
      </div>

      {/* Desktop table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="hidden w-full text-sm md:table">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Piece</th>
              <th className="px-4 py-3 text-left">Shipping Status</th>
              <th className="px-4 py-3 text-left">Carrier / Tracking</th>
              <th className="px-4 py-3 text-left">Due</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No orders match this filter
                </td>
              </tr>
            )}
            {filtered.map((o) => (
              <tr key={String(o.id)} className="hover:bg-gray-50/70">
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-800">{String(o.customer_name ?? "")}</p>
                  <p className="text-xs text-gray-400">{String(o.phone ?? "")}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {String(o.product || o.category || "—")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                      SHIP_STATUS_COLOR[String(o.shipping_status ?? "pending")] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {SHIP_STATUS_LABEL[String(o.shipping_status ?? "pending")] ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {o.shipping_carrier ? (
                    <span>
                      {String(o.shipping_carrier)}
                      {!!o.tracking_number && (
                        <>
                          <br />
                          <span className="font-mono text-gray-400">
                            {String(o.tracking_number)}
                          </span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {o.due_date ? fmtDate(String(o.due_date)) : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-[#8a5a32] hover:text-white"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile list */}
        <ul className="divide-y divide-gray-100 md:hidden">
          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-gray-400">
              No orders match this filter
            </li>
          )}
          {filtered.map((o) => (
            <li key={String(o.id)}>
              <Link
                href={`/admin/orders/${o.id}`}
                className="flex items-start justify-between px-4 py-3.5 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {String(o.customer_name ?? "")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {String(o.product || o.category || "Custom")}
                  </p>
                  {!!o.shipping_carrier && (
                    <p className="text-xs text-gray-400">
                      {String(o.shipping_carrier)}
                      {!!o.tracking_number && ` · ${String(o.tracking_number)}`}
                    </p>
                  )}
                  {!!o.due_date && (
                    <p className="mt-0.5 text-xs font-medium text-[#8a5a32]">
                      Due {fmtDate(String(o.due_date))}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                    SHIP_STATUS_COLOR[String(o.shipping_status ?? "pending")] ??
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {SHIP_STATUS_LABEL[String(o.shipping_status ?? "pending")] ?? "—"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FilterCard({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active ? `${color} ring-2 ring-offset-1 ring-current` : `${color} opacity-70 hover:opacity-100`
      }`}
    >
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs font-semibold">{label}</p>
    </button>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
