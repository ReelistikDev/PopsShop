"use client";

import { useState, FormEvent } from "react";
import { site } from "@/data/site";

type CategoryOption = { slug: string; name: string };

const BUDGET_OPTIONS = [
  "Not sure yet",
  "Under $100",
  "$100 – $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000+",
];

export function OrderForm({
  categories,
  initialCategory = "",
  initialProduct = "",
}: {
  categories: CategoryOption[];
  initialCategory?: string;
  initialProduct?: string;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot
    if ((data.get("company") as string)?.trim()) return;

    const errs: Record<string, string> = {};
    if (!String(data.get("customerName") ?? "").trim()) errs.customerName = "Name is required.";
    if (!String(data.get("phone") ?? "").trim()) errs.phone = "Phone number is required.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const lines: string[] = [
      `🪵 *New Piece Request — ${site.name}*`,
      "",
    ];

    const add = (label: string, key: string) => {
      const v = String(data.get(key) ?? "").trim();
      if (v) lines.push(`*${label}:* ${v}`);
    };

    add("Name", "customerName");
    add("Phone", "phone");
    add("Email", "email");
    add("Category", "category");
    add("Specific piece", "product");
    add("Dimensions", "dimensions");
    add("Wood type", "woodType");
    add("Finish / color", "finish");
    add("Quantity", "quantity");
    add("Budget", "budget");
    add("Needed by", "deadline");
    add("Notes", "notes");

    const message = lines.join("\n");
    const url = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    form.reset();
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center">
        <WhatsAppIcon className="h-14 w-14 text-[#25D366]" />
        <div>
          <h2 className="font-serif text-2xl font-bold text-walnut">WhatsApp opened!</h2>
          <p className="mt-2 text-espresso/80">
            Your request has been pre-filled in WhatsApp. Just tap <strong>Send</strong> to reach
            Lenwood directly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="btn-outline text-sm"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot — visually hidden, must stay empty */}
      <div aria-hidden className="hidden">
        <label>
          Company (leave blank)
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Fieldset legend="Your contact info">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" required error={errors.customerName}>
            <input name="customerName" type="text" required autoComplete="name" className={inputClass} />
          </Field>
          <Field label="Phone number" required error={errors.phone} hint="We'll reply via WhatsApp">
            <input name="phone" type="tel" required autoComplete="tel" className={inputClass} />
          </Field>
        </div>
        <Field label="Email" hint="Optional">
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
      </Fieldset>

      <div className="flex flex-col items-start gap-3 border-t border-sand-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-espresso/70">
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          Opens WhatsApp — no payment, we&apos;ll talk details &amp; pricing.
        </p>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Send via WhatsApp
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.827L.057 23.882a.5.5 0 0 0 .61.61l6.101-1.48A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.032-1.388l-.36-.214-3.742.907.934-3.653-.235-.375A9.818 9.818 0 1 1 12 21.818z" />
    </svg>
  );
}
