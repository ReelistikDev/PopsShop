import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
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
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET ? "SET" : "not set (using default)",
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

  // 5. Jose JWT verify
  try {
    const { jwtVerify, SignJWT } = await import("jose");
    const secret = new TextEncoder().encode(
      process.env.ADMIN_SESSION_SECRET ?? "lbwc-admin-secret-2024"
    );
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

  return NextResponse.json(results, { status: 200 });
}
