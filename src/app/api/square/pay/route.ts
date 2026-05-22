import { NextResponse } from "next/server";
import { getSquareClient, SQUARE_LOCATION_ID } from "@/lib/square";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { sourceId, token, paymentType } = (await req.json()) as {
      sourceId: string;
      token: string;
      paymentType: "deposit" | "paid";
    };

    if (!sourceId || !token || !paymentType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const sb = getSupabaseAdmin();
    if (!sb) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });

    const { data: order } = await sb
      .from("woodworking_orders")
      .select("id, quote_amount, deposit_amount, payment_status")
      .eq("payment_token", token)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "This order has already been paid in full." }, { status: 409 });
    }

    const amount =
      paymentType === "paid"
        ? (order.quote_amount ?? 0)
        : (order.deposit_amount ?? 0);

    if (amount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount." }, { status: 400 });
    }

    const sq = getSquareClient();
    if (!sq) return NextResponse.json({ error: "Payment processor unavailable." }, { status: 503 });

    const result = await sq.payments.create({
      sourceId,
      idempotencyKey: `${order.id}-${paymentType}-${Date.now()}`,
      amountMoney: {
        amount: BigInt(Math.round(amount * 100)),
        currency: "USD",
      },
      locationId: SQUARE_LOCATION_ID,
      referenceId: token,
      note: paymentType,
    });

    if (!result?.payment) {
      return NextResponse.json({ error: "Payment failed. Please try again." }, { status: 402 });
    }

    await sb
      .from("woodworking_orders")
      .update({ payment_status: paymentType })
      .eq("id", order.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Square pay error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
