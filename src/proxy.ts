import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }
  const token = req.cookies.get("admin_session")?.value;
  if (!token || !(await verifySessionToken(token))) {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete("admin_session");
    return res;
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
