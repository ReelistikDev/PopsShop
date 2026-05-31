export const site = {
  name: "LB's Wood-Crafts",
  shortName: "LB's",
  tagline: "Handcrafted, custom wood pieces — made by hand in Camden, SC.",
  intro:
    "Lenwood Beasley has been crafting custom wood pieces right here in Camden, South Carolina. " +
    "Every table, sign, shelf, and keepsake is cut and finished by hand. " +
    "Tell us what you're dreaming up and we'll build it just for you.",
  contactEmail: "landbeasl@live.com",
  displayPhone: "803-572-7016",
  whatsappNumber: "18035727016",
  ownerName: "Lenwood Beasley",
  established: "Camden, SC",
  location: "Built by hand in Camden, SC",
} as const;

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/custom-order", label: "Custom Order" },
  { href: "/contact", label: "Contact" },
];
