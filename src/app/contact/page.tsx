import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.ownerName} at ${site.name} in ${site.established}.`,
};

export default function ContactPage() {
  const waUrl = `https://wa.me/${site.whatsappNumber}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-xl">
        <p className="eyebrow">Contact Us</p>
        <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Get in Touch</h1>
        <p className="mt-4 text-lg leading-relaxed text-espresso/80">
          Have a question about a custom piece or want to talk through an idea? Reach out directly —
          we&apos;re happy to chat.
        </p>
      </header>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {/* Business card panel */}
        <div className="rounded-[var(--radius-card)] border-2 border-wood-dark bg-sand p-8 shadow-md">
          {/* Wood-sign header */}
          <div className="mb-6 border-b border-wood-dark/40 pb-5 text-center">
            <div className="mb-1 flex items-center justify-center gap-2">
              <TreeIcon className="h-8 w-8 text-espresso" />
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-espresso">
              {site.name}
            </h2>
          </div>

          <dl className="space-y-4 text-espresso">
            <div>
              <dt className="eyebrow text-wood-dark">Craftsman</dt>
              <dd className="mt-1 font-serif text-xl font-semibold">{site.ownerName}</dd>
            </div>

            <div>
              <dt className="eyebrow text-wood-dark">Location</dt>
              <dd className="mt-1 text-base">{site.established}</dd>
            </div>

            <div>
              <dt className="eyebrow text-wood-dark">Phone</dt>
              <dd className="mt-1">
                <a
                  href={`tel:${site.displayPhone}`}
                  className="text-base font-medium text-walnut transition-colors hover:text-wood-dark"
                >
                  {site.displayPhone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="eyebrow text-wood-dark">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-base font-medium text-walnut transition-colors hover:text-wood-dark"
                >
                  {site.contactEmail}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Actions panel */}
        <div className="flex flex-col gap-5">
          <ActionCard
            icon={<WhatsAppIcon className="h-7 w-7 text-[#25D366]" />}
            title="Message on WhatsApp"
            description={`Chat directly with ${site.ownerName} on WhatsApp for the quickest response.`}
            href={waUrl}
            external
            label="Open WhatsApp"
          />

          <ActionCard
            icon={<PhoneIcon className="h-7 w-7 text-wood-dark" />}
            title="Call Us"
            description={`Give us a call at ${site.displayPhone}. We love talking shop.`}
            href={`tel:${site.displayPhone}`}
            label="Call Now"
          />

          <ActionCard
            icon={<MailIcon className="h-7 w-7 text-wood-dark" />}
            title="Send an Email"
            description="Drop us a line and we'll get back to you as soon as we can."
            href={`mailto:${site.contactEmail}`}
            label="Send Email"
          />

          <ActionCard
            icon={<TreeIcon className="h-7 w-7 text-wood-dark" />}
            title="Request a Custom Piece"
            description="Fill out our request form and we'll reach back out via WhatsApp to talk through the details."
            href="/custom-order"
            label="Start a Request"
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  href,
  label,
  external,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  label: string;
  external?: boolean;
}) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div className="rounded-[var(--radius-card)] border border-sand-dark bg-cream-50 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="font-serif text-lg font-bold text-walnut">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-espresso/75">{description}</p>
          <Link
            href={href}
            {...linkProps}
            className="btn-outline mt-3 text-sm"
          >
            {label}
          </Link>
        </div>
      </div>
    </div>
  );
}

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 6 9h3l-4 5h3.5l-3 4H11v3h2v-3h2.5l-3-4H16l-4-5h3z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.827L.057 23.882a.5.5 0 0 0 .61.61l6.101-1.48A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.032-1.388l-.36-.214-3.742.907.934-3.653-.235-.375A9.818 9.818 0 1 1 12 21.818z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.09 6.09l1.64-1.64a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
