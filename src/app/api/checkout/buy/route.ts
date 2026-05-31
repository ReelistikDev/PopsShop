import { NextResponse } from "next/server";
import { getSquareClient, SQUARE_LOCATION_ID } from "@/lib/square";
import { getSupabaseAdmin } from "@/lib/supabase";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";

function getSiteUrl(reqUrl: string): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) {
    return env.startsWith("http") ? env.replace(/\/$/, "") : `https://${env.replace(/\/$/, "")}`;
  }
  return new URL(reqUrl).origin;
}

export async function POST(req: Request) {
  try {
    const { slug } = (await req.json()) as { slug?: string };
    if (!slug) {
      return NextResponse.json({ error: "Missing product slug." }, { status: 400 });
    }

    const sb = getSupabaseAdmin();
    if (!sb) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });

    const { data: product } = await sb
      .from("products")
      .select("id, slug, name, price, stock_type, stock_quantity, shipping_cost, active")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    if (product.price == null || product.price <= 0) {
      return NextResponse.json({ error: "This product can't be purchased online yet." }, { status: 400 });
    }
    if (product.stock_type === "in_stock" && (product.stock_quantity ?? 0) <= 0) {
      return NextResponse.json({ error: "Sold out." }, { status: 409 });
    }

    const sq = getSquareClient();
    if (!sq) return NextResponse.json({ error: "Payment processor unavailable." }, { status: 503 });
    if (!SQUARE_LOCATION_ID) {
      return NextResponse.json({ error: "Payment processor not configured." }, { status: 503 });
    }

    const siteUrl = getSiteUrl(req.url);
    const priceCents = BigInt(Math.round(product.price * 100));
    const shippingCents = BigInt(Math.round((product.shipping_cost ?? 0) * 100));

    const result = await sq.checkout.paymentLinks.create({
      idempotencyKey: `${product.id}-${Date.now()}`,
      quickPay: {
        name: product.name,
        priceMoney: { amount: priceCents, currency: "USD" },
        locationId: SQUARE_LOCATION_ID,
      },
      checkoutOptions: {
        askForShippingAddress: true,
        redirectUrl: `${siteUrl}/order-success`,
        merchantSupportEmail: site.contactEmail,
        ...(shippingCents > BigInt(0) && {
          shippingFee: {
            name: "Shipping",
            charge: { amount: shippingCents, currency: "USD" },
          },
        }),
      },
      paymentNote: `purchase:${product.slug}`,
    });

    const url = result?.paymentLink?.url ?? result?.paymentLink?.longUrl;
    if (!url) {
      return NextResponse.json({ error: "Could not create checkout link." }, { status: 502 });
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Square checkout/buy error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
