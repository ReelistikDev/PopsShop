import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = { title: "Dashboard · Admin" };

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

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  category: string | null;
  product: string | null;
  status: string;
  quote_amount: number | null;
  deposit_amount: number | null;
  due_date: string | null;
  created_at: string | null;
  budget: string | null;
};

async function getOrders(): Promise<Order[]> {
  try {
    const sb = getSupabaseAdmin();
    if (!sb) return [];
    const { data } = await sb
      .from("woodworking_orders")
      .select(
        "id, customer_name, phone, category, product, status, quote_amount, deposit_amount, due_date, created_at, budget"
      )
      .order("created_at", { ascending: false });
    return (data ?? []) as Order[];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const orders = await getOrders();

  const total = orders.length;
  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status ?? "new"] = (acc[o.status ?? "new"] ?? 0) + 1;
    return acc;
  }, {});
  const newCount = byStatus.new ?? 0;
  const activeCount =
    (byStatus.quoted ?? 0) +
    (byStatus.approved ?? 0) +
    (byStatus.in_progress ?? 0);
  const totalQuoted = orders.reduce((s, o) => s + (o.quote_amount ?? 0), 0);
  const totalDeposits = orders.reduce(
    (s, o) => s + (o.deposit_amount ?? 0),
    0
  );
  const balanceDue = totalQuoted - totalDeposits;
  const recent = orders.slice(0, 8);

  // Upcoming due dates (next 14 days)
  const now = new Date();
  const soon = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const upcoming = orders
    .filter(
      (o) =>
        o.due_date &&
        new Date(o.due_date) >= now &&
        new Date(o.due_date) <= soon
    )
    .sort(
      (a, b) =>
        new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
    )
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          LB&apos;s Wood-Crafts — Order Overview
        </p>
      </div>

      {/* Metric cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Orders"
          value={total}
          sub="all time"
          color="bg-[#8a5a32]"
        />
        <MetricCard
          label="New / Unread"
          value={newCount}
          sub="need attention"
          color="bg-blue-600"
        />
        <MetricCard
          label="Active Jobs"
          value={activeCount}
          sub="in progress"
          color="bg-orange-500"
        />
        <MetricCard
          label="Total Quoted"
          value={`$${totalQuoted.toLocaleString()}`}
          sub={`$${totalDeposits.toLocaleString()} received · $${balanceDue.toLocaleString()} due`}
          color="bg-green-600"
        />
      </div>

      {/* Status breakdown */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Orders by Status
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_LABEL).map(([s, label]) => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                STATUS_COLOR[s] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {label}
              <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-xs">
                {byStatus[s] ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-gray-700">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-[#8a5a32] hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {recent.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-gray-400">
                No orders yet
              </li>
            )}
            {recent.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {o.customer_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {o.product || o.category || "Custom piece"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.quote_amount ? (
                      <span className="text-xs font-semibold text-green-700">
                        ${o.quote_amount}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        {o.budget || "—"}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                        STATUS_COLOR[o.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming due dates */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-gray-700">
              Due in Next 14 Days
            </h2>
            <Link
              href="/admin/calendar"
              className="text-xs font-medium text-[#8a5a32] hover:underline"
            >
              Calendar →
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {upcoming.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-gray-400">
                No upcoming deadlines
              </li>
            )}
            {upcoming.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {o.customer_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {o.product || o.category || "Custom piece"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#8a5a32]">
                      {formatDate(o.due_date!)}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                        STATUS_COLOR[o.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
  value: string | number;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div
        className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
      >
        <span className="text-lg font-bold text-white">#</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-0.5 text-[0.65rem] text-gray-400">{sub}</p>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
