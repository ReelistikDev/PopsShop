import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s · Admin",
    default: "Admin · LB's Woodshop",
  },
};

/**
 * Admin root layout — strips the public SiteHeader/SiteFooter
 * so admin pages render in a clean full-screen shell.
 * The children here are either /admin/login or the (protected) route group.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
