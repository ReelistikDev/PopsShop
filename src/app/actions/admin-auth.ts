"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials, createSessionToken } from "@/lib/admin-auth";

export type AuthState = { error?: string };

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!(await verifyCredentials(username, password))) {
    return { error: "Invalid username or password." };
  }
  const token = await createSessionToken();
  (await cookies()).set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}
