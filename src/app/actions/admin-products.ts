"use server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export type ProductPayload = {
  slug: string;
  name: string;
  category: string;
  image_url: string | null;
  alt: string | null;
  blurb: string | null;
  size_note: string | null;
  wood_note: string | null;
  finish_note: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/custom-order");
  revalidatePath("/admin/products");
}

export async function addProductAction(data: ProductPayload) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const { error } = await sb.from("products").insert(data);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function updateProductAction(id: string, data: ProductPayload) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const { error } = await sb.from("products").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  revalidatePath(`/products/${data.slug}`);
  return { ok: true };
}

export async function deleteProductAction(id: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function toggleProductFieldAction(
  id: string,
  field: "active" | "featured",
  value: boolean
) {
  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };
  const { error } = await sb.from("products").update({ [field]: value }).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function uploadProductImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "No file provided" };

  const sb = getSupabaseAdmin();
  if (!sb) return { error: "Database not configured" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await sb.storage
    .from("product-images")
    .upload(filename, bytes, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = sb.storage.from("product-images").getPublicUrl(filename);
  return { url: data.publicUrl };
}
