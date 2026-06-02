"use client";
import Image from "next/image";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  addProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductFieldAction,
  uploadProductImageAction,
  type ProductPayload,
} from "@/app/actions/admin-products";

type Product = ProductPayload & { id: string; created_at: string };

const CATEGORIES = [
  "Tables & Furniture",
  "Shelves & Storage",
  "Signs & Plaques",
  "Cutting Boards",
  "Holiday & Seasonal",
  "Memorial & Keepsakes",
  "Custom",
];

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const EMPTY: Omit<ProductPayload, "slug"> & { slug: string } = {
  slug: "",
  name: "",
  category: CATEGORIES[0],
  image_url: null,
  alt: null,
  blurb: null,
  price: null,
  stock_type: "made_to_order",
  stock_quantity: 0,
  lead_time: null,
  shipping_cost: 0,
  size_note: null,
  wood_note: null,
  finish_note: null,
  featured: false,
  active: true,
  sort_order: 0,
};

export function ProductsClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY });
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      slug: p.slug,
      name: p.name,
      category: p.category,
      image_url: p.image_url,
      alt: p.alt,
      blurb: p.blurb,
      price: p.price,
      stock_type: p.stock_type ?? "made_to_order",
      stock_quantity: p.stock_quantity ?? 0,
      lead_time: p.lead_time,
      shipping_cost: p.shipping_cost ?? 0,
      size_note: p.size_note,
      wood_note: p.wood_note,
      finish_note: p.finish_note,
      featured: p.featured,
      active: p.active,
      sort_order: p.sort_order,
    });
    setFormError(null);
    setShowForm(true);
    setTimeout(() => document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormError(null);
  }

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: editing ? f.slug : toSlug(name),
    }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const result = await uploadProductImageAction(fd);
    setUploading(false);
    if (result.error) {
      setFormError(`Image upload failed: ${result.error}`);
    } else if (result.url) {
      setForm((f) => ({ ...f, image_url: result.url ?? null }));
    }
    e.target.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    if (!form.slug.trim()) { setFormError("Slug is required."); return; }
    if (!form.category.trim()) { setFormError("Category is required."); return; }
    setFormError(null);

    const payload: ProductPayload = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim(),
      category: form.category.trim(),
      alt: form.alt?.trim() || null,
      blurb: form.blurb?.trim() || null,
      price: form.price,
      lead_time: form.lead_time?.trim() || null,
      size_note: form.size_note?.trim() || null,
      wood_note: form.wood_note?.trim() || null,
      finish_note: form.finish_note?.trim() || null,
    };

    startTransition(async () => {
      const res = editing
        ? await updateProductAction(editing.id, payload)
        : await addProductAction(payload);
      if (res?.error) {
        if (res.error === "slug_duplicate") {
          setFormError("That URL slug is already taken — change the slug and try again.");
          document.getElementById("field-slug")?.focus();
        } else {
          setFormError(res.error);
        }
        return;
      }
      closeForm();
      router.refresh();
    });
  }

  function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProductAction(p.id);
      router.refresh();
    });
  }

  function handleToggle(p: Product, field: "active" | "featured") {
    startTransition(async () => {
      await toggleProductFieldAction(p.id, field, !p[field]);
      router.refresh();
    });
  }

  const inp =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8a5a32]";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-lg bg-[#8a5a32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a4f2c] disabled:opacity-50"
          disabled={isPending}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div id="product-form" className="rounded-xl border border-[#e8dcc8] bg-amber-50 p-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[#8a5a32]">
            {editing ? "Edit Product" : "New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Farmhouse Console Table"
                  className={inp}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Slug * <span className="font-normal text-gray-400">(URL: /products/slug)</span>
                </label>
                <input
                  id="field-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="farmhouse-console-table"
                  className={inp}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Category *</label>
                <input
                  type="text"
                  list="category-options"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Tables & Furniture"
                  className={inp}
                  required
                />
                <datalist id="category-options">
                  {CATEGORIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Starting Price <span className="font-normal text-gray-400">(optional, shown as "From $X")</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value ? parseFloat(e.target.value) : null }))}
                    placeholder="0.00"
                    className={`${inp} pl-7`}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className={inp}
                />
              </div>
            </div>

            {/* Inventory & Shipping */}
            <div className="rounded-lg border border-[#e8dcc8] bg-white/60 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#8a5a32]">
                Inventory & Shipping
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Stock Type</label>
                  <select
                    value={form.stock_type}
                    onChange={(e) => setForm((f) => ({ ...f, stock_type: e.target.value as "in_stock" | "made_to_order" }))}
                    className={inp}
                  >
                    <option value="made_to_order">Made to Order</option>
                    <option value="in_stock">In Stock</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Shipping Cost <span className="font-normal text-gray-400">(per order)</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.shipping_cost}
                      onChange={(e) => setForm((f) => ({ ...f, shipping_cost: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className={`${inp} pl-7`}
                    />
                  </div>
                </div>
                {form.stock_type === "in_stock" ? (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Quantity Available
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock_quantity}
                      onChange={(e) => setForm((f) => ({ ...f, stock_quantity: parseInt(e.target.value) || 0 }))}
                      className={inp}
                    />
                    <p className="mt-1 text-[0.7rem] text-gray-400">Shown as &quot;Sold Out&quot; when zero.</p>
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      Lead Time <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.lead_time ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, lead_time: e.target.value || null }))}
                      placeholder="e.g., 2–3 weeks"
                      className={inp}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Product Image</label>
              <div className="flex items-start gap-3">
                {form.image_url && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <Image src={form.image_url} alt="preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={form.image_url ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value || null }))}
                    placeholder="https://... or upload below"
                    className={inp}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {uploading ? "Uploading…" : "Upload from computer"}
                    </button>
                    {form.image_url && (
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image_url: null }))}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Alt Text</label>
              <input
                type="text"
                value={form.alt ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value || null }))}
                placeholder="A handcrafted farmhouse console table"
                className={inp}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Description (Blurb)</label>
              <textarea
                rows={3}
                value={form.blurb ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value || null }))}
                placeholder="A brief description shown on the products page and detail page…"
                className={`${inp} resize-y`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Size Note</label>
                <input
                  type="text"
                  value={form.size_note ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, size_note: e.target.value || null }))}
                  placeholder="Made to your dimensions"
                  className={inp}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Wood Note</label>
                <input
                  type="text"
                  value={form.wood_note ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, wood_note: e.target.value || null }))}
                  placeholder="Pine, oak, walnut, cedar"
                  className={inp}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Finish Note</label>
                <input
                  type="text"
                  value={form.finish_note ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, finish_note: e.target.value || null }))}
                  placeholder="Any stain or paint color"
                  className={inp}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="accent-[#8a5a32]"
                />
                Active (visible on site)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="accent-[#8a5a32]"
                />
                Featured (shown on homepage)
              </label>
            </div>

            {formError && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{formError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isPending || uploading}
                className="rounded-lg bg-[#8a5a32] px-5 py-2 text-sm font-semibold text-white hover:bg-[#7a4f2c] disabled:opacity-50"
              >
                {isPending ? "Saving…" : editing ? "Save Changes" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {products.length === 0 ? (
          <div className="px-5 py-16 text-center text-gray-400">
            <p className="text-sm">No products yet.</p>
            <button
              onClick={openAdd}
              className="mt-2 text-sm font-semibold text-[#8a5a32] hover:underline"
            >
              Add your first product →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="hidden px-4 py-3 text-left sm:table-cell">Category</th>
                  <th className="hidden px-4 py-3 text-left sm:table-cell">Price</th>
                  <th className="hidden px-4 py-3 text-left lg:table-cell">Stock</th>
                  <th className="px-4 py-3 text-center">Active</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50 ${!p.active ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                            <Image src={p.image_url} alt={p.alt ?? p.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-300">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400">/products/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{p.category}</td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                      {p.price != null ? `$${p.price.toLocaleString()}` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {p.stock_type === "in_stock" ? (
                        p.stock_quantity > 0 ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            {p.stock_quantity} in stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            Sold out
                          </span>
                        )
                      ) : (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                          Made to order
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(p, "active")}
                        disabled={isPending}
                        className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.active ? "bg-green-500" : "bg-gray-200"}`}
                        title={p.active ? "Click to hide" : "Click to show"}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.active ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(p, "featured")}
                        disabled={isPending}
                        className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.featured ? "bg-[#8a5a32]" : "bg-gray-200"}`}
                        title={p.featured ? "Remove from homepage" : "Show on homepage"}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.featured ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs font-semibold text-[#8a5a32] hover:underline"
                          disabled={isPending}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="text-xs font-semibold text-red-500 hover:underline"
                          disabled={isPending}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
