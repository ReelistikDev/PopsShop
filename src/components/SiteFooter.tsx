import Link from "next/link";
import { site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const waUrl = `https://wa.me/${site.whatsappNumber}`;

  return (
    <footer className="border-t border-walnut/20 bg-bark text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl font-bold text-cream-50">{site.name}</h3>
          <p className="mt-1 text-sm text-wood">{site.ownerName}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream-100/80">
            {site.tagline}
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-wood">
            {site.established}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-wood">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/products" className="text-cream-100/80 transition-colors hover:text-cream-50">
                Shop All Pieces
              </Link>
            </li>
            <li>
              <Link href="/custom-order" className="text-cream-100/80 transition-colors hover:text-cream-50">
                Request a Custom Piece
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-cream-100/80 transition-colors hover:text-cream-50">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-wood">Get in Touch</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-100/80">
            <li>
              <a href={`tel:${site.displayPhone}`} className="transition-colors hover:text-cream-50">
                {site.displayPhone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contactEmail}`} className="transition-colors hover:text-cream-50">
                {site.contactEmail}
              </a>
            </li>
          </ul>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 text-sm"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-cream-100/60 sm:px-6">
          © {year} {site.name} · {site.established}. Handmade with care.
        </div>
      </div>
    </footer>
  );
}
