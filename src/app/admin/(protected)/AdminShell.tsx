"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/admin-auth";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders",    label: "Orders" },
  { href: "/admin/products",  label: "Products" },
  { href: "/admin/calendar",  label: "Calendar" },
  { href: "/admin/shipping",  label: "Shipping" },
  { href: "/admin/finances",  label: "Finances" },
];

function DashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function ShipIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}
function FinanceIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

const ICONS = [DashIcon, OrderIcon, ProductIcon, CalIcon, ShipIcon, FinanceIcon];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-shrink-0 flex-col bg-[#1a1009] md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#8a5a32]">
            <svg className="h-4 w-4 text-[#f6efe2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
            </svg>
          </div>
          <span className="font-serif text-sm font-bold text-[#f6efe2]">LB&apos;s Admin</span>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item, i) => {
            const Icon = ICONS[i];
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#8a5a32]/80 text-[#f6efe2]"
                    : "text-[#d8c3a2] hover:bg-white/10 hover:text-[#f6efe2]"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#d8c3a2] transition-colors hover:bg-white/10 hover:text-[#f6efe2]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#8a5a32]">
              <svg className="h-4 w-4 text-[#f6efe2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
              </svg>
            </div>
            <span className="font-serif text-sm font-bold text-[#3a2a1d]">LB&apos;s Admin</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="flex border-t border-gray-200 bg-white md:hidden">
          {NAV.map((item, i) => {
            const Icon = ICONS[i];
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                  active ? "text-[#8a5a32]" : "text-gray-400"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
