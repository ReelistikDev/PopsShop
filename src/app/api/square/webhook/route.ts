import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature") ?? "";
    const sigKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

    if (sigKey) {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http") ? "" : "https://"}${process.env.NEXT_PUBLIC_SITE_URL ?? "lbswoodcrafts.com"}/api/square/webhook`;
      const expected = createHmac("sha256", sigKey)
        .update(url + body)
        .digest("base64");
      if (signature !== expected) {
        return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    if (event.type !== "payment.completed") {
      return NextResponse.json({ ok: true });
    }

    const payment = event.data?.object?.payment;
    if (!payment) return NextResponse.json({ ok: true });

    const note = payment.note as string | undefined;
    const sb = getSupabaseAdmin();
    if (!sb) return NextResponse.json({ ok: true });

    // ── Product purchase via Square Payment Link ─────────────────────
    if (note?.startsWith("purchase:")) {
      const slug = note.replace("purchase:", "").trim();

      const { data: product } = await sb
        .from("products")
        .select("id, name, category, stock_type, stock_quantity")
        .eq("slug", slug)
        .single();

      if (product) {
        const addr = payment.shipping_address ?? payment.billing_address;
        const firstName = addr?.first_name ?? "";
        const lastName = addr?.last_name ?? "";
        const customerName = [firstName, lastName].filter(Boolean).join(" ") || "Online Customer";
        const totalCents = (payment.total_money?.amount as number | undefined) ?? 0;
        const totalDollars = totalCents / 100;

        await sb.from("woodworking_orders").insert({
          customer_name: customerName,
          email: payment.buyer_email_address ?? null,
          phone: null,
          category: product.category,
          product: product.name,
          notes: [
            addr?.address_line_1,
            addr?.locality,
            addr?.administrative_district_level_1,
            addr?.postal_code,
          ].filter(Boolean).join(", ") || null,
          status: product.stock_type === "in_stock" ? "complete" : "in_progress",
          payment_status: "paid",
          quote_amount: totalDollars,
          sms_status: "skipped",
        });

        // Decrement stock for in-stock products
        if (product.stock_type === "in_stock" && (product.stock_quantity ?? 0) > 0) {
          await sb
            .from("products")
            .update({ stock_quantity: Math.max(0, (product.stock_quantity ?? 1) - 1) })
            .eq("id", product.id);
        }
      }

      return NextResponse.json({ ok: true });
    }

    // ── Custom order payment via /pay/[token] ────────────────────────
    const token = payment.reference_id as string | undefined;
    const paymentType = note;

    if (!token || !["deposit", "paid"].includes(paymentType ?? "")) {
      return NextResponse.json({ ok: true });
    }

    await sb
      .from("woodworking_orders")
      .update({ payment_status: paymentType })
      .eq("payment_token", token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Square webhook error:", err);
    return NextResponse.json({ error: "Webhook error." }, { status: 500 });
  }
}
