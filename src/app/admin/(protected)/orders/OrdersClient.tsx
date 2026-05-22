"use client";
import Link from "next/link";
import { useState, useMemo } from "react";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  quoted: "Quoted",
  approved: "Approved",
  in_progress: "In Progress",
  complete: "Complete",
  shipped: "Shipped",
  cancelled: "Cancelled",
};
const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  quoted: "bg-yellow-100 text-yellow-800",
  approved: "bg-purple-100 text-purple-800",
  in_progress: "bg-orange-100 text-orange-800",
  complete: "bg-green-100 text-green-800",
  shipped: "bg-teal-100 text-teal-800",
  cancelled: "bg-red-100 text-red-800",
};

type Order = Record<string, unknown>;

export function OrdersClient({
  orders,
  initialStatus,
  initialQ,
}: {
  orders: Order[];
  initialStatus: string;
  initialQ: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [q, setQ] = useState(initialQ);

  const filtered = useMemo(() => {
    let list = orders as Array<Record<string, string | number | null>>;
    if (status) list = list.filter((o) => o.status === status);
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter(
        (o) =>
          String(o.customer_name ?? "")
            .toLowerCase()
            .includes(lower) ||
          String(o.phone ?? "").includes(lower) ||
          String(o.email ?? "")
            .toLowerCase()
            .includes(lower) ||
          String(o.product ?? "")
            .toLowerCase()
            .includes(lower) ||
          String(o.category ?? "")
            .toLowerCase()
            .includes(lower) ||
          String(o.notes ?? "")
            .toLowerCase()
            .includes(lower)
      );
    }
    return list;
  }, [orders, status, q]);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">
            {filtered.length} of {orders.length} orders
          </p>
        </div>
        <Link
          href="/custom-order"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#8a5a32] px-3 py-2 text-sm font-semibold text-white hover:bg-[#6b3f1e]"
        >
          + New Order Form ↗
        </Link>
      </div>

      {/* Filter + Search */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          placeholder="Search name, phone, product…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 shadow-sm outline-none focus:border-[#8a5a32] focus:ring-2 focus:ring-[#8a5a32]/30"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-[#8a5a32]"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Desktop table */}
        <table className="hidden w-full text-sm md:table">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Piece</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Quote</th>
              <th className="px-4 py-3 text-left">Due</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No orders match your filters
                </td>
              </tr>
            )}
            {filtered.map((o) => (
              <tr key={String(o.id)} className="hover:bg-gray-50/70">
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-800">
                    {String(o.customer_name ?? "")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {String(o.phone ?? "")}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {String(o.product || o.category || "—")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                      STATUS_COLOR[String(o.status)] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABEL[String(o.status)] ?? String(o.status)}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-green-700">
                  {o.quote_amount ? (
                    `$${Number(o.quote_amount).toLocaleString()}`
                  ) : (
                    <span className="text-gray-400">
                      {String(o.budget || "—")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {o.due_date ? fmtDate(String(o.due_date)) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {o.created_at ? fmtDate(String(o.created_at)) : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-[#8a5a32] hover:text-white"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile card list */}
        <ul className="divide-y divide-gray-100 md:hidden">
          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-gray-400">
              No orders match your filters
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
                    {String(o.phone ?? "")} ·{" "}
                    {String(o.product || o.category || "Custom")}
                  </p>
                  {o.due_date && (
                    <p className="mt-0.5 text-xs font-medium text-[#8a5a32]">
                      Due {fmtDate(String(o.due_date))}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                      STATUS_COLOR[String(o.status)] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABEL[String(o.status)] ?? String(o.status)}
                  </span>
                  {o.quote_amount && (
                    <span className="text-xs font-semibold text-green-700">
                      ${Number(o.quote_amount).toLocaleString()}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}
