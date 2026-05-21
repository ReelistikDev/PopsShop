/**
 * Static product catalog for Pop's Woodshop.
 *
 * Products are curated showcase pieces — every item is made-to-order, so this is a
 * gallery + inspiration list rather than live inventory. To add a piece, drop a photo
 * in /public/images/products and add an entry below.
 */

export const CATEGORY_SLUGS = [
  "tables",
  "shelves",
  "signs",
  "cutting-boards",
  "custom",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short hook shown on category cards. */
  tagline: string;
  /** Longer copy for the category page header. */
  description: string;
  /** Representative image (path under /public). Empty string = no photo yet. */
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  image: string;
  alt: string;
  /** One or two sentence description. */
  blurb: string;
  /** Optional made-to-order detail hints shown on the detail page. */
  details?: {
    sizeNote?: string;
    woodNote?: string;
    finishNote?: string;
  };
  featured?: boolean;
}

export const categories: Category[] = [
  {
    slug: "tables",
    name: "Tables",
    tagline: "Farmhouse dining, console & accent tables",
    description:
      "Solid-wood tables built for a lifetime of family dinners. Choose your size, wood, and finish — " +
      "from a sturdy harvest table to a slim entryway console.",
    image: "/images/products/tables-console-table.jpg",
  },
  {
    slug: "shelves",
    name: "Shelves",
    tagline: "Wall shelves, cubbies & tiered stands",
    description:
      "Display shelves, storage cubbies, and tiered plant stands — each one fit to your wall and your space.",
    image: "/images/products/shelves-corner-unit.jpg",
  },
  {
    slug: "signs",
    name: "Signs",
    tagline: "Engraved & carved custom signs",
    description:
      "Hand-engraved signs for the home, bar, family, or business. Send us your words and we'll burn them in.",
    image: "/images/products/signs-welcome-frame.jpg",
  },
  {
    slug: "cutting-boards",
    name: "Cutting Boards",
    tagline: "Charcuterie & kitchen boards — made to order",
    description:
      "Hardwood cutting and serving boards, cut and oiled to your size. These are built fresh per order — " +
      "tell us your dimensions and wood and we'll make yours.",
    image: "", // No catalog photo yet — renders as a made-to-order card.
  },
  {
    slug: "custom",
    name: "Custom Projects",
    tagline: "Keepsakes, carvings & one-of-a-kind work",
    description:
      "The pieces that don't fit a category — carved panels, memorial keepsakes, engraved gifts, and whatever " +
      "you can dream up. If it's made of wood, we'll build it.",
    image: "/images/products/custom-rose-shadow-box.jpg",
  },
];

export const products: Product[] = [
  // ---- Tables ----
  {
    slug: "farmhouse-console-table",
    name: "Farmhouse Console Table",
    category: "tables",
    image: "/images/products/tables-console-table.jpg",
    alt: "Two-tone console table with a dark plank top, white base, and a low storage shelf",
    blurb:
      "A two-tone console with a dark plank top and a painted base, plus a low shelf for baskets and bins. Perfect behind the couch or as an entryway coffee bar.",
    details: {
      sizeNote: "Built to your wall length",
      woodNote: "Pine top & base",
      finishNote: "Dark-stained top, base painted any color",
    },
    featured: true,
  },

  // ---- Shelves ----
  {
    slug: "corner-shelf-desk-unit",
    name: "X-Frame Corner Shelf & Desk",
    category: "shelves",
    image: "/images/products/shelves-corner-unit.jpg",
    alt: "White X-frame corner shelving towers with a built-in stained desk surface",
    blurb:
      "A space-saving corner unit — tall X-frame towers flanking a built-in desk or display surface. Made for a home-office nook or a tucked-away reading corner.",
    details: {
      sizeNote: "Sized to fit your corner",
      woodNote: "Painted pine with a stained top",
      finishNote: "White frame, stained work surface",
    },
    featured: true,
  },

  // ---- Signs ----
  {
    slug: "welcome-porch-frame",
    name: "Welcome Porch Frame",
    category: "signs",
    image: "/images/products/signs-welcome-frame.jpg",
    alt: "Torched-wood Welcome frame holding a hanging basket of pansies on a porch",
    blurb:
      "A torched-finish frame built to cradle a hanging basket or wreath, topped with a carved greeting. A warm hello by the front door in every season.",
    details: {
      sizeNote: "Porch / entry size",
      woodNote: "Torched pine",
      finishNote: "Burnt & sealed; your word or name carved in",
    },
  },
  {
    slug: "team-pride-paw-plaque",
    name: "Team Pride Paw Plaque",
    category: "signs",
    image: "/images/products/signs-team-paw.jpg",
    alt: "Rustic framed wooden plaque with a bright painted team paw print",
    blurb:
      "A framed, painted team-pride plaque — your team's paw, mascot, or letters cut and finished in your colors. Game-day decor for the porch, den, or man cave.",
    details: {
      sizeNote: "Wall plaque",
      woodNote: "Framed birch & pine",
      finishNote: "Painted in your team's colors",
    },
  },
  {
    slug: "engraved-faith-cross",
    name: "Engraved Faith Cross",
    category: "signs",
    image: "/images/products/signs-faith-cross.jpg",
    alt: "Standing engraved wooden plaque with a layered starburst cross and scripture",
    blurb:
      "A slim engraved cross plaque with a layered starburst center and the verse or saying of your choosing. A heartfelt gift for confirmations, weddings, and remembrances.",
    details: {
      sizeNote: "Tabletop / shelf size",
      woodNote: "Layered birch",
      finishNote: "Engraved with your words",
    },
  },
  {
    slug: "snarky-mini-sign-set",
    name: "Snarky Mini Sign Set",
    category: "signs",
    image: "/images/products/signs-sarcastic-sign-set.jpg",
    alt: "A set of small engraved wooden signs with sarcastic one-liner sayings",
    blurb:
      "A set of pocket-size engraved signs loaded with attitude. Mix and match the sayings on offer, or send us your own one-liners and we'll burn them in.",
    details: {
      sizeNote: "Set of small tiles",
      woodNote: "Engraved hardwood",
      finishNote: "Your sayings — pick the snark",
    },
    featured: true,
  },
  {
    slug: "old-people-humor-sign",
    name: "“Old People” Humor Sign",
    category: "signs",
    image: "/images/products/signs-old-people.jpg",
    alt: "Engraved wooden sign reading Don't Piss Off Old People, the older we get the less in prison is a deterrent",
    blurb:
      "Our best-selling laugh, engraved deep into the grain. Want a cleaner punchline or your own saying? Send it over and we'll engrave that instead.",
    details: {
      sizeNote: "Small to large",
      woodNote: "Stained hardwood",
      finishNote: "Engraved; decorative corners optional",
    },
  },
  {
    slug: "kitchen-menu-sign",
    name: "Kitchen “Menu” Sign",
    category: "signs",
    image: "/images/products/signs-menu-sign.jpg",
    alt: "Engraved kitchen sign reading Today's Menu: Eat It or Starve",
    blurb:
      "A tongue-in-cheek kitchen sign — “Today's Menu: Eat It or Starve.” A fun farmhouse-kitchen accent, or personalize it with your own family motto.",
    details: {
      sizeNote: "Counter or wall size",
      woodNote: "Engraved pine",
      finishNote: "Decorative border, your wording",
    },
  },

  // ---- Custom Projects ----
  {
    slug: "layered-lake-wall-art",
    name: "Layered Lake Wall Art",
    category: "custom",
    image: "/images/products/custom-fish-wall-art.jpg",
    alt: "Framed layered wood wall art of fish and reeds over a blue painted background",
    blurb:
      "Layered wood wall art — cut fish and reeds floating over a painted backdrop. A striking centerpiece for a lake house, cabin, or sunroom.",
    details: {
      sizeNote: "Framed wall size",
      woodNote: "Layered birch in a wood frame",
      finishNote: "Painted layers in your colors",
    },
  },
  {
    slug: "north-pole-santa-cam",
    name: "North Pole Surveillance Santa Cam",
    category: "custom",
    image: "/images/products/custom-santa-cam.jpg",
    alt: "Wooden windmill Santa Cam with a smiling elf, labeled North Pole Surveillance",
    blurb:
      "A playful “Santa Cam” windmill that keeps an eye on the good little ones all December. A keepsake holiday piece the kids will ask about every year.",
    details: {
      sizeNote: "Tabletop display",
      woodNote: "Galvanized + stained wood",
      finishNote: "Seasonal; elf sitter optional",
    },
  },
  {
    slug: "cardinal-memorial-ornament",
    name: "Cardinal Memorial Ornament",
    category: "custom",
    image: "/images/products/custom-cardinal-ornament.jpg",
    alt: "Round wood ornament with a cut tree and two red cardinals reading Cardinals appear when angels are near",
    blurb:
      "A round layered ornament — “Cardinals appear when angels are near.” A gentle memorial keepsake; add a name or date for the family.",
    details: {
      sizeNote: "Ornament size",
      woodNote: "Layered birch",
      finishNote: "Hand-painted cardinals; personalize the text",
    },
    featured: true,
  },
  {
    slug: "christmas-in-heaven-ornament",
    name: "Christmas in Heaven Ornament",
    category: "custom",
    image: "/images/products/custom-christmas-heaven-ornament.jpg",
    alt: "Round engraved ornament on a beaded hanger reading Christmas in Heaven with an empty chair",
    blurb:
      "A beaded-hanger ornament engraved with the “Christmas in Heaven” poem and an empty chair — a tender way to keep a loved one at the table.",
    details: {
      sizeNote: "Ornament size",
      woodNote: "Engraved birch",
      finishNote: "Add their name; beaded hanger included",
    },
  },
  {
    slug: "drink-up-grinches-caddy",
    name: "“Drink Up Grinches” Caddy",
    category: "custom",
    image: "/images/products/custom-grinch-drink-caddy.jpg",
    alt: "Round green wooden drink caddy with cup cutouts and a Grinch face reading Drink Up Grinches",
    blurb:
      "A round party caddy that holds a flight of cups or shots — “Drink Up Grinches.” A grinning holiday crowd-pleaser; ask about other themes year-round.",
    details: {
      sizeNote: "Holds 4–6 glasses",
      woodNote: "Painted plywood",
      finishNote: "Themed engraving & paint",
    },
  },
  {
    slug: "carved-rose-shadow-box",
    name: "Carved Rose “Love” Shadow Box",
    category: "custom",
    image: "/images/products/custom-rose-shadow-box.jpg",
    alt: "Hinged wooden shadow box with a layered carved red rose and the word love behind a lattice door",
    blurb:
      "A hinged keepsake box with a layered carved rose and a lattice door. A romantic gift for an anniversary, Valentine's, or a “just because.”",
    details: {
      sizeNote: "Keepsake box",
      woodNote: "Layered hardwood",
      finishNote: "Carved rose; optional name or date",
    },
  },
  {
    slug: "personalized-candle-caddy",
    name: "Personalized Candle Caddy",
    category: "custom",
    image: "/images/products/custom-candle-caddy.jpg",
    alt: "Engraved wooden candle caddy holding a row of glass votives, engraved with a family name",
    blurb:
      "An engraved caddy holding a row of glass votives, personalized with your family name. A warm centerpiece for the table or mantel.",
    details: {
      sizeNote: "3–5 votives",
      woodNote: "Stained pine",
      finishNote: "Engraved name; votives included",
    },
  },
];

// ---- Helpers ----

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getProduct(category: string, slug: string): Product | undefined {
  return products.find((p) => p.category === category && p.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}
