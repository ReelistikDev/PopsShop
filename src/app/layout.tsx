import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";


const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

function getSiteUrl() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://popswoodshop.com");
  } catch {
    return new URL("https://popswoodshop.com");
  }
}

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    template: `%s · ${site.name}`,
    default: `${site.name} · Handmade, Made-to-Order Woodwork`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name} · Handmade Woodwork`,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-espresso">
        {children}
      </body>
    </html>
  );
}
