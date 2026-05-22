import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/admin-auth";
import { AdminShell } from "./AdminShell";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("admin_session")?.value;
  if (!token || !(await verifySessionToken(token))) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
