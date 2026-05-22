"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks, site } from "@/data/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="wood-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">

        {/* Brand — engraved-on-wood look */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <TreeMark className="h-7 w-7 text-sand drop-shadow-sm" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold tracking-wide text-sand drop-shadow sm:text-xl">
              {site.name}
            </span>
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-sand/60">
              {site.established}
            </span>
          </div>
        </Link>

        {/* Desktop nav — wood-sign tabs */}
        <nav className="hidden items-end gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-sign">
              {link.label}
            </Link>
          ))}
          <Link
            href="/custom-order"
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-barn px-3.5 py-1.5 text-sm font-bold text-cream-50 shadow-md transition hover:bg-red-900 active:translate-y-px"
          >
            Request a Piece
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-sand md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — wood-toned panel */}
      {open && (
        <nav
          className="border-t border-black/30 bg-walnut/95 px-4 pb-4 pt-2 backdrop-blur-sm md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-semibold text-sand/90 hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/custom-order"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-barn px-4 py-2.5 text-center text-sm font-bold text-cream-50 hover:bg-red-900"
              >
                Request a Piece
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function TreeMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
    </svg>
  );
}
