"use client";

import { useActionState } from "react";
import { submitOrder, type OrderState } from "@/app/actions/submit-order";

type CategoryOption = { slug: string; name: string };

const BUDGET_OPTIONS = [
  "Not sure yet",
  "Under $100",
  "$100 – $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000+",
];

const initialState: OrderState = { ok: true };

export function OrderForm({
  categories,
  initialCategory = "",
  initialProduct = "",
}: {
  categories: CategoryOption[];
  initialCategory?: string;
  initialProduct?: string;
}) {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      {!state.ok && state.message && (
        <p
          role="alert"
          className="rounded-lg border border-barn/40 bg-barn/10 px-4 py-3 text-sm font-medium text-barn"
        >
          {state.message}
        </p>
      )}

      {/* Honeypot — visually hidden, must stay empty */}
      <div aria-hidden className="hidden">
        <label>
          Company (leave blank)
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Fieldset legend="Your contact info">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" required error={err.customerName}>
            <input name="customerName" type="text" required autoComplete="name" className={inputClass} />
          </Field>
          <Field label="Phone number" required error={err.phone} hint="We'll text you back here">
            <input name="phone" type="tel" required autoComplete="tel" className={inputClass} />
          </Field>
        </div>
        <Field label="Email" error={err.email} hint="Optional">
          <input name="email" type="email" autoComplete="email" className={inputClass} />
        </Field>
      </Fieldset>

      <Fieldset legend="What you'd like made">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select name="category" defaultValue={initialCategory} className={inputClass}>
              <option value="">Choose a category…</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
              <option value="other">Something else</option>
            </select>
          </Field>
          <Field label="Specific piece" hint="Optional">
            <input
              name="product"
              type="text"
              defaultValue={initialProduct}
              placeholder="e.g., Farmhouse Harvest Table"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Desired dimensions" hint="Length × width × height, if known">
          <input name="dimensions" type="text" placeholder={'e.g., 72" L × 36" W × 30" H'} className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Wood type" hint="Optional">
            <input name="woodType" type="text" placeholder="Oak, pine, maple, walnut…" list="wood-options" className={inputClass} />
            <datalist id="wood-options">
              <option value="Pine" />
              <option value="Oak" />
              <option value="Maple" />
              <option value="Walnut" />
              <option value="Cedar" />
              <option value="Reclaimed / barnwood" />
              <option value="Not sure" />
            </datalist>
          </Field>
          <Field label="Stain / color preference" hint="Optional">
            <input name="finish" type="text" placeholder="Walnut stain, natural, white paint…" className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Quantity">
            <input name="quantity" type="text" defaultValue="1" className={inputClass} />
          </Field>
          <Field label="Budget range">
            <select name="budget" defaultValue="" className={inputClass}>
              <option value="">Choose a range…</option>
              {BUDGET_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Deadline / date needed" hint="A date, an occasion, or 'no rush'">
          <input name="deadline" type="text" placeholder="e.g., by June 1, or no rush" className={inputClass} />
        </Field>

        <Field label="Additional notes">
          <textarea
            name="notes"
            rows={4}
            placeholder="Tell us anything else — the room it's for, a design you saw, special requests…"
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Inspiration photo" hint="Optional · JPG or PNG, up to 10 MB">
          <input
            name="photo"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-espresso/80 file:mr-4 file:rounded-full file:border-0 file:bg-wood-dark file:px-4 file:py-2 file:font-semibold file:text-cream-50 hover:file:bg-walnut"
          />
        </Field>
      </Fieldset>

      <div className="flex flex-col items-start gap-3 border-t border-sand-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-espresso/70">
          No payment now — we&apos;ll text you back to talk details and pricing.
        </p>
        <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto disabled:opacity-60">
          {pending ? "Sending…" : "Send My Request"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-sand-dark bg-cream-50 px-3.5 py-2.5 text-espresso shadow-sm outline-none transition focus:border-wood-dark focus:ring-2 focus:ring-wood/40";

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="font-serif text-xl font-bold text-walnut">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-walnut">
          {label}
          {required && <span className="text-barn"> *</span>}
        </span>
        {hint && <span className="text-xs text-espresso/55">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-barn">{error}</span>}
    </label>
  );
}
