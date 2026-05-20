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
    image: "/images/products/tables-farmhouse-table.jpg",
  },
  {
    slug: "shelves",
    name: "Shelves",
    tagline: "Wall shelves, cubbies & tiered stands",
    description:
      "Display shelves, storage cubbies, and tiered plant stands — each one fit to your wall and your space.",
    image: "/images/products/shelves-triangle-shelves.jpg",
  },
  {
    slug: "signs",
    name: "Signs",
    tagline: "Engraved & carved custom signs",
    description:
      "Hand-engraved signs for the home, bar, family, or business. Send us your words and we'll burn them in.",
    image: "/images/products/signs-pub-sign.jpg",
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
    image: "/images/products/custom-carved-panel.jpg",
  },
];

export const products: Product[] = [
  // ---- Tables ----
  {
    slug: "farmhouse-harvest-table",
    name: "Farmhouse Harvest Table",
    category: "tables",
    image: "/images/products/tables-farmhouse-table.jpg",
    alt: "Solid wood farmhouse harvest table with a walnut-stained top and painted base",
    blurb:
      "A solid-top harvest table with a hand-finished walnut surface and a sturdy painted base. Sized to seat your whole family.",
    details: {
      sizeNote: "Common sizes 5–8 ft; built to your length",
      woodNote: "Oak, pine, or maple top",
      finishNote: "Walnut, dark roast, or natural — base in any color",
    },
    featured: true,
  },
  {
    slug: "entryway-console-table",
    name: "Entryway Console Table",
    category: "tables",
    image: "/images/products/tables-console-table.jpg",
    alt: "Slim wooden console table with a light top and white base",
    blurb:
      "A slim console for an entryway or behind the couch — light wood top, painted base, and a low shelf for baskets.",
    details: {
      sizeNote: "Tailored to your wall length",
      woodNote: "Pine or oak",
      finishNote: "Two-tone top and base of your choosing",
    },
  },

  // ---- Shelves ----
  {
    slug: "mountain-peak-wall-shelves",
    name: "Mountain Peak Wall Shelves",
    category: "shelves",
    image: "/images/products/shelves-triangle-shelves.jpg",
    alt: "Set of triangular peak-shaped wood wall shelves",
    blurb:
      "Peak-shaped floating shelves that group beautifully on a wall. Sold as a set or singly.",
    details: {
      sizeNote: "Single, pair, or trio",
      woodNote: "Pine or stained hardwood",
      finishNote: "Natural, honey, or dark stain",
    },
    featured: true,
  },
  {
    slug: "tiered-plant-ladder",
    name: "Tiered Plant Ladder",
    category: "shelves",
    image: "/images/products/shelves-tiered-stand.jpg",
    alt: "Three-tier torched-wood ladder plant stand",
    blurb:
      "A leaning, torched-finish ladder stand for plants, pots, and porch displays. Built for indoors or covered patios.",
    details: {
      sizeNote: "2, 3, or 4 tiers",
      woodNote: "Pine with torched finish",
      finishNote: "Burnt, natural, or sealed for outdoors",
    },
  },
  {
    slug: "rustic-tiered-stand",
    name: "Rustic Tiered Stand",
    category: "shelves",
    image: "/images/products/shelves-tiered-bench.jpg",
    alt: "Low rustic tiered wooden display stand",
    blurb:
      "A low, wide tiered stand — perfect for a plant corner, farm stand, or market display.",
    details: {
      sizeNote: "Built to your footprint",
      woodNote: "Pine or reclaimed lumber",
      finishNote: "Torched, stained, or raw",
    },
  },
  {
    slug: "farmhouse-cubby-cabinet",
    name: "Farmhouse Cubby Cabinet",
    category: "shelves",
    image: "/images/products/shelves-cubby-cabinet.jpg",
    alt: "White multi-compartment cubby storage cabinet",
    blurb:
      "A painted cubby cabinet with open compartments for mudrooms, craft rooms, and entryways.",
    details: {
      sizeNote: "Custom cubby count & dimensions",
      woodNote: "Painted pine",
      finishNote: "Any paint color or stain",
    },
  },

  // ---- Signs ----
  {
    slug: "custom-pub-bar-sign",
    name: "Custom Pub & Bar Sign",
    category: "signs",
    image: "/images/products/signs-pub-sign.jpg",
    alt: "Ornate engraved wooden pub and bar sign",
    blurb:
      "A richly engraved bar sign with your name, crest, or saying. The showpiece for a home bar or man cave.",
    details: {
      sizeNote: "Wall plaque or large statement size",
      woodNote: "Birch ply or hardwood",
      finishNote: "Stained & sealed, your wording engraved",
    },
    featured: true,
  },
  {
    slug: "engraved-humor-sign",
    name: "Engraved Humor Sign",
    category: "signs",
    image: "/images/products/signs-humor-sign.jpg",
    alt: "Engraved wooden sign with a humorous saying",
    blurb:
      "A laugh-out-loud engraved sign — send us your saying and we'll burn it into the grain.",
    details: {
      sizeNote: "Small to large",
      woodNote: "Pine or birch",
      finishNote: "Natural or stained background",
    },
  },
  {
    slug: "decorative-wall-cross",
    name: "Decorative Wall Cross",
    category: "signs",
    image: "/images/products/signs-decorative-cross.jpg",
    alt: "Decorative engraved wooden wall cross",
    blurb:
      "A layered, engraved wall cross — a heartfelt gift for weddings, baptisms, and remembrances.",
    details: {
      sizeNote: "Tabletop or wall size",
      woodNote: "Birch & hardwood layers",
      finishNote: "Add a name, date, or verse",
    },
  },
  {
    slug: "mothers-prayer-plaque",
    name: "Mother's Prayer Plaque",
    category: "signs",
    image: "/images/products/signs-mothers-prayer.jpg",
    alt: "Framed engraved plaque with a prayer and tree-of-life design",
    blurb:
      "A framed, engraved keepsake plaque featuring a tree-of-life and your chosen verse or prayer.",
    details: {
      sizeNote: "Framed plaque",
      woodNote: "Engraved hardwood in a wood frame",
      finishNote: "Your words & names engraved",
    },
  },
  {
    slug: "family-tree-round-sign",
    name: "Family Tree Round Sign",
    category: "signs",
    image: "/images/products/signs-family-tree-round.jpg",
    alt: "Round engraved family tree sign",
    blurb:
      "A round engraved sign with a family tree and your last name, established date, or members.",
    details: {
      sizeNote: 'Round, 12"–24"',
      woodNote: "Birch ply",
      finishNote: "Names & dates engraved",
    },
  },
  {
    slug: "framed-family-blessing",
    name: "Framed Family Blessing",
    category: "signs",
    image: "/images/products/signs-family-tree-framed.jpg",
    alt: "Framed engraved family blessing sign",
    blurb:
      "A framed engraved blessing or house rules sign — a warm welcome by the front door.",
    details: {
      sizeNote: "Framed, wall size",
      woodNote: "Engraved hardwood",
      finishNote: "Custom wording in a stained frame",
    },
  },

  // ---- Custom Projects ----
  {
    slug: "carved-lattice-panel",
    name: "Carved Lattice Panel",
    category: "custom",
    image: "/images/products/custom-carved-panel.jpg",
    alt: "Intricately carved wooden lattice decorative panel",
    blurb:
      "An intricate carved lattice panel — stunning as wall art, a room divider accent, or a headboard inset.",
    details: {
      sizeNote: "Made to your opening",
      woodNote: "Hardwood",
      finishNote: "Stained or natural",
    },
    featured: true,
  },
  {
    slug: "keepsake-memorial-ornament",
    name: "Keepsake Memorial Ornament",
    category: "custom",
    image: "/images/products/custom-keepsake-ornament.jpg",
    alt: "Round engraved keepsake ornament on a beaded hanger",
    blurb:
      "A round engraved keepsake on a beaded hanger — a thoughtful memorial or holiday gift.",
    details: {
      sizeNote: "Ornament size",
      woodNote: "Birch",
      finishNote: "Engraved with your poem or names",
    },
  },
  {
    slug: "personalized-candle-caddy",
    name: "Personalized Candle Caddy",
    category: "custom",
    image: "/images/products/custom-candle-caddy-family.jpg",
    alt: "Wooden candle caddy with engraved lettering and glass votives",
    blurb:
      "An engraved wooden caddy holding glass votives — a warm centerpiece personalized with your words.",
    details: {
      sizeNote: "3–5 votive sizes",
      woodNote: "Pine or hardwood",
      finishNote: "Engraved & sealed, votives included",
    },
  },
  {
    slug: "engraved-gift-caddy",
    name: "Engraved Gift Caddy",
    category: "custom",
    image: "/images/products/custom-candle-caddy-coworker.jpg",
    alt: "Engraved wooden gift caddy with candles",
    blurb:
      "A ready-to-gift engraved caddy — perfect for coworkers, teachers, and thank-yous.",
    details: {
      sizeNote: "Gift size",
      woodNote: "Pine or hardwood",
      finishNote: "Personalized engraving",
    },
  },
  {
    slug: "engraved-wood-bookmarks",
    name: "Engraved Wood Bookmarks",
    category: "custom",
    image: "/images/products/custom-bookmarks.jpg",
    alt: "Set of engraved wooden bookmarks",
    blurb:
      "Slim engraved wood bookmarks — lovely as party favors, classroom gifts, or shop add-ons.",
    details: {
      sizeNote: "Singles or sets",
      woodNote: "Thin birch",
      finishNote: "Engraved designs & names",
    },
  },
  {
    slug: "custom-engraved-keepsakes",
    name: "Custom Engraved Keepsakes",
    category: "custom",
    image: "/images/products/custom-variety-display.jpg",
    alt: "Display of assorted custom engraved wooden keepsakes",
    blurb:
      "Coasters, tags, ornaments, and round signs — a sample of the small engraved keepsakes we make to order.",
    details: {
      sizeNote: "Various",
      woodNote: "Birch & hardwoods",
      finishNote: "Fully personalized",
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
