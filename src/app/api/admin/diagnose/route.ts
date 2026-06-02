import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  // This endpoint exposes configuration diagnostics — require a valid admin
  // session. Respond 404 to unauthenticated callers so it isn't discoverable.
  const sessionToken = (await cookies()).get("admin_session")?.value;
  if (!sessionToken || !(await verifySessionToken(sessionToken))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const results: Record<string, unknown> = {};

  // 1. Environment variables
  results.env = {
    SUPABASE_URL: process.env.SUPABASE_URL
      ? process.env.SUPABASE_URL.slice(0, 30) + "..."
      : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "SET (length=" + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ")"
      : "MISSING",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "not set",
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET ? "SET" : "not set (REQUIRED — admin login will fail)",
    NODE_ENV: process.env.NODE_ENV,
  };

  // 2. NEXT_PUBLIC_SITE_URL URL parse check
  try {
    const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lbswoodcrafts.com";
    new URL(raw);
    results.siteUrlParse = { ok: true, value: raw };
  } catch (e) {
    results.siteUrlParse = { ok: false, error: String(e) };
  }

  // 3. SUPABASE_URL parse check
  try {
    const raw = process.env.SUPABASE_URL ?? "";
    new URL(raw);
    results.supabaseUrlParse = { ok: true };
  } catch (e) {
    results.supabaseUrlParse = { ok: false, error: String(e) };
  }

  // 4. Cookie read
  try {
    const jar = await cookies();
    const token = jar.get("admin_session")?.value;
    results.cookie = { ok: true, hasToken: !!token, tokenLength: token?.length ?? 0 };
  } catch (e) {
    results.cookie = { ok: false, error: String(e) };
  }

  // 5. Jose JWT verify (round-trips the configured secret; no fallback)
  try {
    const secretStr = process.env.ADMIN_SESSION_SECRET;
    if (!secretStr) throw new Error("ADMIN_SESSION_SECRET not set");
    const { jwtVerify, SignJWT } = await import("jose");
    const secret = new TextEncoder().encode(secretStr);
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1m")
      .sign(secret);
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    results.jose = { ok: true };
  } catch (e) {
    results.jose = { ok: false, error: String(e) };
  }

  // 6. Supabase client creation
  let sb: import("@supabase/supabase-js").SupabaseClient | null = null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL ?? "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    results.supabaseClient = { ok: true };
  } catch (e) {
    results.supabaseClient = { ok: false, error: String(e) };
  }

  // 7. Supabase query
  if (sb) {
    try {
      const { data, error } = await sb
        .from("woodworking_orders")
        .select("id")
        .limit(1);
      results.supabaseQuery = { ok: !error, count: data?.length ?? 0, error: error?.message };
    } catch (e) {
      results.supabaseQuery = { ok: false, error: String(e) };
    }
  } else {
    results.supabaseQuery = { ok: false, error: "client not created" };
  }

  // 8. Square config check + live auth test
  const sqToken = process.env.SQUARE_ACCESS_TOKEN ?? "";
  const sqEnv = process.env.SQUARE_ENV ?? "";
  const sqLocationId = process.env.SQUARE_LOCATION_ID ?? "";
  results.square = {
    SQUARE_ENV: sqEnv || "not set (defaults to sandbox)",
    SQUARE_ACCESS_TOKEN: sqToken ? `SET (length=${sqToken.length}, starts="${sqToken.slice(0, 6)}...")` : "MISSING",
    SQUARE_ACCESS_TOKEN_HAS_WHITESPACE: sqToken !== sqToken.trim(),
    SQUARE_LOCATION_ID: sqLocationId ? `SET (length=${sqLocationId.length})` : "MISSING",
    SQUARE_WEBHOOK_SIGNATURE_KEY: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ? "SET" : "not set",
  };

  // Live Square auth test — calls /v2/locations to verify token works
  try {
    const baseUrl = sqEnv === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";
    const resp = await fetch(`${baseUrl}/v2/locations`, {
      headers: { Authorization: `Bearer ${sqToken}`, "Square-Version": "2024-01-18" },
    });
    const body = await resp.json() as Record<string, unknown>;
    if (resp.ok) {
      const locations = (body.locations as Array<Record<string, unknown>> | undefined) ?? [];
      results.squareAuthTest = {
        ok: true,
        status: resp.status,
        locationCount: locations.length,
        locationIds: locations.map((l) => l.id),
      };
    } else {
      results.squareAuthTest = { ok: false, status: resp.status, body };
    }
  } catch (e) {
    results.squareAuthTest = { ok: false, error: String(e) };
  }

  return NextResponse.json(results, { status: 200 });
}
