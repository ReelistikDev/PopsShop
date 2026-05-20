/**
 * Central site configuration for Pop's Woodshop.
 * Edit business name, tagline, and contact details here — everything else reads from this.
 */

export const site = {
  name: "Pop's Woodshop",
  shortName: "Pop's",
  tagline: "Handcrafted, made-to-order woodwork — from our family workshop to your home.",
  intro:
    "For three generations, our family has turned rough-sawn lumber into heirloom pieces built to last. " +
    "Every table, shelf, sign, and keepsake is cut, joined, and finished by hand right here in the shop. " +
    "Tell us what you're dreaming up and we'll build it just for you.",
  // Shown in the footer. The actual SMS destination is set via the BUSINESS_PHONE env var on the server.
  contactEmail: "hello@popswoodshop.com",
  // Optional public-facing phone for display only. Leave empty to hide.
  displayPhone: "",
  established: "Est. 1962",
  location: "Built by hand in the USA",
} as const;

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/custom-order", label: "Custom Order" },
];
