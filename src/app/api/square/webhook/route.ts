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

    const token = payment.reference_id as string | undefined;
    const paymentType = payment.note as string | undefined;

    if (!token || !["deposit", "paid"].includes(paymentType ?? "")) {
      return NextResponse.json({ ok: true });
    }

    const sb = getSupabaseAdmin();
    if (!sb) return NextResponse.json({ ok: true });

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
