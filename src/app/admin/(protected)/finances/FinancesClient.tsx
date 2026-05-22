"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type FinOrder = {
  id: string;
  customer_name: string;
  category: string | null;
  product: string | null;
  status: string;
  quote_amount: number | null;
  deposit_amount: number | null;
  due_date: string | null;
  created_at: string | null;
};

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

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function shortDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function getLastNMonths(n: number) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    };
  });
}

const MONTHS = getLastNMonths(12);

type SortField = "created_at" | "quote_amount" | "balance";
type Range = "all" | "year" | "month";

export function FinancesClient({ orders }: { orders: FinOrder[] }) {
  const [range, setRange] = useState<Range>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    if (range === "all") return orders;
    const now = new Date();
    const cutoff =
      range === "year"
        ? new Date(now.getFullYear(), 0, 1)
        : new Date(now.getFullYear(), now.getMonth(), 1);
    return orders.filter((o) => o.created_at && new Date(o.created_at) >= cutoff);
  }, [orders, range]);

  const active = useMemo(() => filtered.filter((o) => o.status !== "cancelled"), [filtered]);

  const totalQuoted = active.reduce((s, o) => s + (o.quote_amount ?? 0), 0);
  const totalReceived = active.reduce((s, o) => s + (o.deposit_amount ?? 0), 0);
  const outstanding = totalQuoted - totalReceived;
  const pipelineOrders = active.filter((o) =>
    ["quoted", "approved", "in_progress"].includes(o.status)
  );
  const pipeline = pipelineOrders.reduce((s, o) => s + (o.quote_amount ?? 0), 0);
  const quotedCount = active.filter((o) => o.quote_amount).length;
  const avgOrder = quotedCount ? Math.round(totalQuoted / quotedCount) : 0;
  const completedRev = active
    .filter((o) => o.status === "shipped")
    .reduce((s, o) => s + (o.quote_amount ?? 0), 0);
  const depositRate =
    active.length
      ? Math.round(
          (active.filter((o) => (o.deposit_amount ?? 0) > 0).length / active.length) * 100
        )
      : 0;

  // Monthly chart uses all orders regardless of range filter
  const monthlyData = useMemo(() => {
    return MONTHS.map(({ key, label }) => {
      const mo = orders.filter((o) => {
        if (!o.created_at || o.status === "cancelled") return false;
        const d = new Date(o.created_at);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === key;
      });
      return {
        key,
        label,
        quoted: mo.reduce((s, o) => s + (o.quote_amount ?? 0), 0),
        received: mo.reduce((s, o) => s + (o.deposit_amount ?? 0), 0),
        count: mo.length,
      };
    });
  }, [orders]);
  const maxMonthly = Math.max(...monthlyData.map((m) => m.quoted), 1);

  const byStatus = useMemo(() => {
    const map: Record<string, { count: number; quoted: number; received: number }> = {};
    for (const o of filtered) {
      const s = o.status ?? "new";
      if (!map[s]) map[s] = { count: 0, quoted: 0, received: 0 };
      map[s].count++;
      map[s].quoted += o.quote_amount ?? 0;
      map[s].received += o.deposit_amount ?? 0;
    }
    return Object.entries(STATUS_LABEL)
      .map(([s, label]) => ({ status: s, label, ...(map[s] ?? { count: 0, quoted: 0, received: 0 }) }))
      .filter((r) => r.count > 0);
  }, [filtered]);

  const byCategory = useMemo(() => {
    const map: Record<string, { count: number; quoted: number }> = {};
    for (const o of filtered) {
      if (o.status === "cancelled") continue;
      const c = o.category || "Uncategorized";
      if (!map[c]) map[c] = { count: 0, quoted: 0 };
      map[c].count++;
      map[c].quoted += o.quote_amount ?? 0;
    }
    return Object.entries(map)
      .map(([cat, d]) => ({ cat, ...d }))
      .sort((a, b) => b.quoted - a.quoted);
  }, [filtered]);

  const needsQuote = active.filter((o) => o.status === "new" && !o.quote_amount);
  const approvedNoDeposit = active.filter(
    (o) => ["approved", "in_progress"].includes(o.status) && !o.deposit_amount
  );
  const balanceDueOrders = active.filter(
    (o) =>
      ["complete", "shipped"].includes(o.status) &&
      (o.quote_amount ?? 0) > (o.deposit_amount ?? 0)
  );

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = 0,
        bv = 0;
      if (sortField === "created_at") {
        av = a.created_at ? new Date(a.created_at).getTime() : 0;
        bv = b.created_at ? new Date(b.created_at).getTime() : 0;
      } else if (sortField === "quote_amount") {
        av = a.quote_amount ?? 0;
        bv = b.quote_amount ?? 0;
      } else {
        av = (a.quote_amount ?? 0) - (a.deposit_amount ?? 0);
        bv = (b.quote_amount ?? 0) - (b.deposit_amount ?? 0);
      }
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [filtered, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const showActions =
    needsQuote.length > 0 || approvedNoDeposit.length > 0 || balanceDueOrders.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finances</h1>
          <p className="text-sm text-gray-500">LB&apos;s Wood-Crafts — Financial Overview</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a5a32]"
        >
          <option value="all">All Time</option>
          <option value="year">This Year</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Primary metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Quoted"
          value={fmt(totalQuoted)}
          sub={`${quotedCount} quoted order${quotedCount !== 1 ? "s" : ""}`}
          color="bg-[#8a5a32]"
        />
        <MetricCard
          label="Total Received"
          value={fmt(totalReceived)}
          sub={`${totalQuoted ? Math.round((totalReceived / totalQuoted) * 100) : 0}% of quoted`}
          color="bg-green-600"
        />
        <MetricCard
          label="Outstanding"
          value={fmt(outstanding)}
          sub="balance still owed"
          color="bg-orange-500"
        />
        <MetricCard
          label="Pipeline"
          value={fmt(pipeline)}
          sub={`${pipelineOrders.length} active job${pipelineOrders.length !== 1 ? "s" : ""}`}
          color="bg-blue-600"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Avg Order Value
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(avgOrder)}</p>
          <p className="mt-0.5 text-[0.65rem] text-gray-400">across quoted orders</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Completed Revenue
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(completedRev)}</p>
          <p className="mt-0.5 text-[0.65rem] text-gray-400">shipped orders</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Deposit Rate
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{depositRate}%</p>
          <p className="mt-0.5 text-[0.65rem] text-gray-400">orders with deposit paid</p>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Monthly Revenue — Last 12 Months
        </h2>
        <div className="flex items-end gap-1" style={{ height: "110px" }}>
          {monthlyData.map((m) => {
            const barH = maxMonthly ? Math.round((m.quoted / maxMonthly) * 88) : 0;
            const fillH = m.quoted ? Math.round((m.received / m.quoted) * 100) : 0;
            return (
              <div key={m.key} className="group relative flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t bg-[#d8c3a2] relative overflow-hidden"
                  style={{ height: `${barH}px`, minHeight: barH > 0 ? "4px" : "0" }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#8a5a32]"
                    style={{ height: `${fillH}%` }}
                  />
                  {m.quoted > 0 && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] leading-tight text-white shadow group-hover:block">
                      <span className="font-semibold">{m.label}</span>
                      <br />
                      Quoted: {fmt(m.quoted)}
                      <br />
                      Received: {fmt(m.received)}
                      <br />
                      {m.count} order{m.count !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
                <span className="mt-1 text-[9px] text-gray-400">{m.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-3 rounded bg-[#d8c3a2]" />
            Quoted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-3 rounded bg-[#8a5a32]" />
            Received
          </span>
        </div>
      </div>

      {/* Action items */}
      {showActions && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Needs Attention
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {needsQuote.length > 0 && (
              <ActionList
                title="Needs Quote"
                badge={needsQuote.length}
                badgeColor="bg-blue-100 text-blue-700"
                items={needsQuote.map((o) => ({
                  id: o.id,
                  name: o.customer_name,
                  sub: o.product || o.category || "Custom piece",
                  value: o.created_at ? shortDate(o.created_at) : "—",
                }))}
              />
            )}
            {approvedNoDeposit.length > 0 && (
              <ActionList
                title="Approved — No Deposit"
                badge={approvedNoDeposit.length}
                badgeColor="bg-orange-100 text-orange-700"
                items={approvedNoDeposit.map((o) => ({
                  id: o.id,
                  name: o.customer_name,
                  sub: o.product || o.category || "Custom piece",
                  value: o.quote_amount ? fmt(o.quote_amount) : "—",
                }))}
              />
            )}
            {balanceDueOrders.length > 0 && (
              <ActionList
                title="Balance Due — Complete"
                badge={balanceDueOrders.length}
                badgeColor="bg-red-100 text-red-700"
                items={balanceDueOrders.map((o) => ({
                  id: o.id,
                  name: o.customer_name,
                  sub: o.product || o.category || "Custom piece",
                  value: fmt((o.quote_amount ?? 0) - (o.deposit_amount ?? 0)),
                }))}
              />
            )}
          </div>
        </div>
      )}

      {/* Status & Category breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-gray-700">Revenue by Status</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-2 text-left">Status</th>
                <th className="px-5 py-2 text-right">#</th>
                <th className="px-5 py-2 text-right">Quoted</th>
                <th className="px-5 py-2 text-right">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {byStatus.map((r) => (
                <tr key={r.status} className="hover:bg-gray-50">
                  <td className="px-5 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                        STATUS_COLOR[r.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.label}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right text-gray-500">{r.count}</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-gray-800">
                    {r.quoted ? fmt(r.quoted) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-2.5 text-right text-green-700">
                    {r.received ? fmt(r.received) : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
              {byStatus.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-gray-700">Revenue by Category</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-2 text-left">Category</th>
                <th className="px-5 py-2 text-right">#</th>
                <th className="px-5 py-2 text-right">Quoted</th>
                <th className="px-5 py-2 text-right">Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {byCategory.map((r) => (
                <tr key={r.cat} className="hover:bg-gray-50">
                  <td className="px-5 py-2.5 font-medium text-gray-800">{r.cat}</td>
                  <td className="px-5 py-2.5 text-right text-gray-500">{r.count}</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-gray-800">
                    {r.quoted ? fmt(r.quoted) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-2.5 text-right text-gray-500">
                    {r.count ? fmt(Math.round(r.quoted / r.count)) : "—"}
                  </td>
                </tr>
              ))}
              {byCategory.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All orders table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-700">
            All Orders — Financial View
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({sorted.length} order{sorted.length !== 1 ? "s" : ""})
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-2 text-left">Customer</th>
                <th className="hidden px-5 py-2 text-left sm:table-cell">Piece</th>
                <th className="px-5 py-2 text-left">Status</th>
                <th
                  className="cursor-pointer select-none px-5 py-2 text-right hover:text-gray-600"
                  onClick={() => toggleSort("quote_amount")}
                >
                  Quote{" "}
                  {sortField === "quote_amount" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th className="hidden px-5 py-2 text-right sm:table-cell">Received</th>
                <th
                  className="cursor-pointer select-none px-5 py-2 text-right hover:text-gray-600"
                  onClick={() => toggleSort("balance")}
                >
                  Balance{" "}
                  {sortField === "balance" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th
                  className="hidden cursor-pointer select-none px-5 py-2 text-right hover:text-gray-600 sm:table-cell"
                  onClick={() => toggleSort("created_at")}
                >
                  Date{" "}
                  {sortField === "created_at" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((o) => {
                const balance = (o.quote_amount ?? 0) - (o.deposit_amount ?? 0);
                const isPaid = o.quote_amount !== null && balance <= 0;
                return (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-5 py-2.5">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-semibold text-gray-800 hover:text-[#8a5a32]"
                      >
                        {o.customer_name}
                      </Link>
                    </td>
                    <td className="hidden px-5 py-2.5 text-gray-500 sm:table-cell">
                      {o.product || o.category || "—"}
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                          STATUS_COLOR[o.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-right font-semibold text-gray-800">
                      {o.quote_amount ? (
                        fmt(o.quote_amount)
                      ) : (
                        <span className="font-normal text-gray-300">—</span>
                      )}
                    </td>
                    <td className="hidden px-5 py-2.5 text-right text-green-700 sm:table-cell">
                      {o.deposit_amount ? (
                        fmt(o.deposit_amount)
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      {o.quote_amount === null ? (
                        <span className="text-gray-300">—</span>
                      ) : isPaid ? (
                        <span className="font-semibold text-green-600">Paid</span>
                      ) : (
                        <span className="font-semibold text-orange-600">{fmt(balance)}</span>
                      )}
                    </td>
                    <td className="hidden px-5 py-2.5 text-right text-xs text-gray-400 sm:table-cell">
                      {o.created_at ? shortDate(o.created_at) : "—"}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div
        className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
      >
        <span className="text-sm font-bold text-white">$</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-0.5 text-[0.65rem] text-gray-400">{sub}</p>
    </div>
  );
}

function ActionList({
  title,
  badge,
  badgeColor,
  items,
}: {
  title: string;
  badge: number;
  badgeColor: string;
  items: Array<{ id: string; name: string; sub: string; value: string }>;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <ul className="divide-y divide-gray-50">
        {items.slice(0, 5).map((item) => (
          <li key={item.id}>
            <Link
              href={`/admin/orders/${item.id}`}
              className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <span className="text-sm font-bold text-gray-600">{item.value}</span>
            </Link>
          </li>
        ))}
        {items.length > 5 && (
          <li className="px-5 py-2 text-center text-xs text-gray-400">
            +{items.length - 5} more
          </li>
        )}
      </ul>
    </div>
  );
}
