"use client";
import Link from "next/link";
import { useState, useMemo } from "react";

const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-500",
  quoted: "bg-yellow-500",
  approved: "bg-purple-500",
  in_progress: "bg-orange-500",
  complete: "bg-green-500",
  shipped: "bg-teal-500",
  cancelled: "bg-red-500",
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

type CalOrder = {
  id: string;
  customer_name: string;
  product: string | null;
  category: string | null;
  status: string;
  due_date: string;
};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function CalendarClient({ orders }: { orders: CalOrder[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Build map: dateStr -> orders[]
  const ordersByDate = useMemo(() => {
    const map: Record<string, CalOrder[]> = {};
    for (const o of orders) {
      const d = o.due_date.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(o);
    }
    return map;
  }, [orders]);

  // Calendar grid
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = firstDay.getDay(); // 0=Sun
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = firstDay.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const selectedOrders = selectedDay ? (ordersByDate[selectedDay] ?? []) : [];

  // Upcoming list (all future due dates + today)
  const todayStr = isoDate(today);
  const upcoming = orders.filter((o) => o.due_date.slice(0, 10) >= todayStr);
  const past = orders.filter((o) => o.due_date.slice(0, 10) < todayStr);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Calendar</h1>
        <p className="text-sm text-gray-500">Due dates for all active orders</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Calendar */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          {/* Nav */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-gray-800">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="py-1 text-[0.65rem] font-bold uppercase tracking-wide text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayOrders = ordersByDate[dateStr] ?? [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                  className={`relative flex min-h-[2.5rem] flex-col items-center justify-start rounded-lg p-1 text-sm transition ${
                    isSelected
                      ? "bg-[#8a5a32] text-white"
                      : isToday
                        ? "bg-[#f1e7d5] font-bold text-[#8a5a32]"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-semibold">{day}</span>
                  {dayOrders.length > 0 && (
                    <div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                      {dayOrders.slice(0, 3).map((o, j) => (
                        <span
                          key={j}
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected
                              ? "bg-white"
                              : (STATUS_COLOR[o.status] ?? "bg-gray-400")
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          {selectedDay && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                {new Date(selectedDay + "T12:00:00").toLocaleDateString(
                  "en-US",
                  { weekday: "long", month: "long", day: "numeric" }
                )}
              </h3>
              {selectedOrders.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No orders due on this day
                </p>
              ) : (
                <ul className="space-y-2">
                  {selectedOrders.map((o) => (
                    <li key={o.id}>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 hover:bg-[#f1e7d5]"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {o.customer_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {o.product || o.category || "Custom"}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white ${
                            STATUS_COLOR[o.status] ?? "bg-gray-400"
                          }`}
                        >
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Side list */}
        <div className="space-y-4">
          {/* Upcoming */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Upcoming
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400">None scheduled</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="block rounded-lg p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          {o.customer_name}
                        </p>
                        <span
                          className={`h-2 w-2 rounded-full ${STATUS_COLOR[o.status] ?? "bg-gray-400"}`}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {o.product || o.category || "Custom"}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-[#8a5a32]">
                        {new Date(
                          o.due_date + "T12:00:00"
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Past due */}
          {past.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-500">
                Past Due
              </h3>
              <ul className="space-y-2">
                {past
                  .slice(-5)
                  .reverse()
                  .map((o) => (
                    <li key={o.id}>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="block rounded-lg p-2 hover:bg-red-100"
                      >
                        <p className="text-sm font-semibold text-red-800">
                          {o.customer_name}
                        </p>
                        <p className="text-xs text-red-600">
                          {new Date(
                            o.due_date + "T12:00:00"
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Full list below calendar */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-700">All Due Dates</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Piece</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No due dates set — edit orders to add them
                </td>
              </tr>
            )}
            {orders.map((o) => {
              const isPast = o.due_date.slice(0, 10) < todayStr;
              return (
                <tr
                  key={o.id}
                  className={`hover:bg-gray-50 ${
                    isPast &&
                    o.status !== "complete" &&
                    o.status !== "shipped"
                      ? "bg-red-50/50"
                      : ""
                  }`}
                >
                  <td
                    className={`px-4 py-3 font-semibold ${
                      isPast &&
                      o.status !== "complete" &&
                      o.status !== "shipped"
                        ? "text-red-600"
                        : "text-[#8a5a32]"
                    }`}
                  >
                    {new Date(
                      o.due_date + "T12:00:00"
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                    {isPast &&
                      o.status !== "complete" &&
                      o.status !== "shipped" && (
                        <span className="ml-1.5 text-[0.6rem] font-bold uppercase text-red-500">
                          Past Due
                        </span>
                      )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {o.customer_name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {o.product || o.category || "Custom"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase text-white ${
                        STATUS_COLOR[o.status] ?? "bg-gray-400"
                      }`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-xs font-medium text-[#8a5a32] hover:underline"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
