"use client";
import { useState, useTransition } from "react";
import { updateOrderAction } from "@/app/actions/admin-orders";

const STATUSES = [
  "new",
  "quoted",
  "approved",
  "in_progress",
  "complete",
  "shipped",
  "cancelled",
];
const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  quoted: "bg-yellow-100 text-yellow-800",
  approved: "bg-purple-100 text-purple-800",
  in_progress: "bg-orange-100 text-orange-800",
  complete: "bg-green-100 text-green-800",
  shipped: "bg-teal-100 text-teal-800",
  cancelled: "bg-red-100 text-red-800",
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

type Order = Record<string, unknown>;

export function OrderDetailForm({ order }: { order: Order }) {
  const id = String(order.id);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updates = {
      status: String(fd.get("status") ?? ""),
      payment_status: String(fd.get("payment_status") ?? "unpaid"),
      quote_amount: fd.get("quote_amount")
        ? Number(fd.get("quote_amount"))
        : null,
      deposit_amount: fd.get("deposit_amount")
        ? Number(fd.get("deposit_amount"))
        : null,
      due_date: String(fd.get("due_date") || "").trim() || null,
      shipping_address:
        String(fd.get("shipping_address") || "").trim() || null,
      shipping_carrier:
        String(fd.get("shipping_carrier") || "").trim() || null,
      tracking_number:
        String(fd.get("tracking_number") || "").trim() || null,
      shipping_status: String(fd.get("shipping_status") ?? "pending"),
      admin_notes: String(fd.get("admin_notes") || "").trim() || null,
    };
    startTransition(async () => {
      const result = await updateOrderAction(id, updates);
      if ("error" in result && result.error) {
        setError(result.error);
        setSaved(false);
      } else {
        setSaved(true);
        setError("");
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  const inp =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#8a5a32] focus:ring-2 focus:ring-[#8a5a32]/20";

  return (
    <div className="space-y-5">
      {/* Customer info (read-only) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            {String(order.customer_name ?? "")}
          </h1>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
              STATUS_COLOR[String(order.status)] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {STATUS_LABEL[String(order.status)] ?? String(order.status)}
          </span>
        </div>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <InfoRow label="Phone" value={String(order.phone ?? "—")} />
          <InfoRow label="Email" value={String(order.email ?? "—")} />
          <InfoRow label="Category" value={String(order.category ?? "—")} />
          <InfoRow label="Product" value={String(order.product ?? "—")} />
          <InfoRow
            label="Dimensions"
            value={String(order.dimensions ?? "—")}
          />
          <InfoRow
            label="Wood Type"
            value={String(order.wood_type ?? "—")}
          />
          <InfoRow label="Finish" value={String(order.finish ?? "—")} />
          <InfoRow label="Quantity" value={String(order.quantity ?? "—")} />
          <InfoRow label="Budget" value={String(order.budget ?? "—")} />
          <InfoRow
            label="Deadline (customer)"
            value={String(order.deadline ?? "—")}
          />
        </div>
        {!!order.notes && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Customer Notes
            </p>
            {String(order.notes)}
          </div>
        )}
        {!!order.photo_url && (
          <a
            href={String(order.photo_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-xs font-medium text-[#8a5a32] hover:underline"
          >
            View inspiration photo ↗
          </a>
        )}
      </div>

      {/* Admin editable fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Status + billing */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Status &amp; Billing
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Status
              </label>
              <select
                name="status"
                defaultValue={String(order.status ?? "new")}
                className={inp}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Payment Status
              </label>
              <select
                name="payment_status"
                defaultValue={String(order.payment_status ?? "unpaid")}
                className={inp}
              >
                <option value="unpaid">Unpaid</option>
                <option value="deposit">Deposit Received</option>
                <option value="paid">Paid in Full</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Quote Amount ($)
              </label>
              <input
                name="quote_amount"
                type="number"
                step="0.01"
                defaultValue={
                  order.quote_amount != null ? String(order.quote_amount) : ""
                }
                placeholder="0.00"
                className={inp}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Deposit Received ($)
              </label>
              <input
                name="deposit_amount"
                type="number"
                step="0.01"
                defaultValue={
                  order.deposit_amount != null
                    ? String(order.deposit_amount)
                    : ""
                }
                placeholder="0.00"
                className={inp}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Due Date
            </label>
            <input
              name="due_date"
              type="date"
              defaultValue={
                order.due_date ? String(order.due_date).slice(0, 10) : ""
              }
              className={`${inp} max-w-xs`}
            />
          </div>
        </div>

        {/* Shipping */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Shipping
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Shipping Status
              </label>
              <select
                name="shipping_status"
                defaultValue={String(order.shipping_status ?? "pending")}
                className={inp}
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Carrier
              </label>
              <input
                name="shipping_carrier"
                type="text"
                defaultValue={String(order.shipping_carrier ?? "")}
                placeholder="UPS, FedEx, USPS…"
                className={inp}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Tracking Number
              </label>
              <input
                name="tracking_number"
                type="text"
                defaultValue={String(order.tracking_number ?? "")}
                placeholder="1Z…"
                className={inp}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Shipping Address
              </label>
              <input
                name="shipping_address"
                type="text"
                defaultValue={String(order.shipping_address ?? "")}
                className={inp}
              />
            </div>
          </div>
        </div>

        {/* Admin notes */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Admin Notes
          </h2>
          <textarea
            name="admin_notes"
            rows={4}
            defaultValue={String(order.admin_notes ?? "")}
            placeholder="Internal notes about this order…"
            className={`${inp} resize-y`}
          />
        </div>

        {/* Payment link */}
        {String(order.status) === "approved" && !!order.payment_token && (
          <div className="rounded-xl border border-[#e8dcc8] bg-amber-50 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8a5a32]">
              Payment Link
            </h2>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/pay/${String(order.payment_token)}`}
                className="flex-1 rounded-lg border border-[#e8dcc8] bg-white px-3 py-2 text-xs text-gray-700 outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/pay/${String(order.payment_token)}`
                  )
                }
                className="rounded-lg bg-[#8a5a32] px-3 py-2 text-xs font-semibold text-white hover:bg-[#7a4f2c]"
              >
                Copy
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Copy this link and send it to the customer (text, email, or WhatsApp).
            </p>
          </div>
        )}

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#8a5a32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6b3f1e] disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save Changes"}
          </button>
          {saved && (
            <p className="text-sm font-medium text-green-600">Saved</p>
          )}
          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}:{" "}
      </span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}
