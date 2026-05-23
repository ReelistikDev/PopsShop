/**
 * Static product catalog for LB's Wood-Crafts.
 *
 * Products are curated showcase pieces — most are also made-to-order, so this doubles as a
 * gallery + a fixed-price shop. To add a piece, drop a photo in /public/images/products
 * and add an entry below.
 *
 * ⚠️ PRICES ARE PLACEHOLDERS. `priceCents` is the online "Buy Now" price in CENTS
 *    (e.g. 4900 = $49.00). Set the real price for every piece before going live —
 *    the checkout charges this exact amount, looked up server-side by slug.
 */

export const CATEGORY_SLUGS = [
  "tables",
  "shelves",
  "signs",
  "keychains",
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
  /** Online "Buy Now" price, in cents (USD). PLACEHOLDER — set the real price. */
  priceCents: number;
  /**
   * If set, the detail page shows a "Personalization" field at checkout with this as the
   * prompt/placeholder (e.g. the name to engrave, the team & colors). The buyer's text rides
   * along on the Square payment note.
   */
  personalization?: string;
  /** When true, the buyer must fill the personalization field before they can pay. */
  personalizationRequired?: boolean;
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
    tagline: "Farmhouse consoles, buffets & accent tables",
    description:
      "Solid-wood tables built for a lifetime of family dinners and gatherings. Choose your size, wood, " +
      "and finish — from a slim entryway console to a long coffee-bar buffet.",
    image: "/images/products/farmhouse-console-table.jpg",
  },
  {
    slug: "shelves",
    name: "Shelves",
    tagline: "Wall shelves, corner units & display pieces",
    description:
      "Display shelves, corner units, and statement wall pieces — each one fit to your wall and your space.",
    image: "/images/products/mountain-peak-shelf.jpg",
  },
  {
    slug: "signs",
    name: "Signs",
    tagline: "Engraved & carved custom signs",
    description:
      "Hand-engraved and carved signs for the home, porch, family, or bar. Send us your words and we'll burn them in.",
    image: "/images/products/not-today-heifer-round.jpg",
  },
  {
    slug: "keychains",
    name: "Keychains",
    tagline: "Engraved hardwood fobs & personalized gifts",
    description:
      "Pocket-size engraved keychains — names, monograms, dates, or a favorite saying burned into smooth hardwood. " +
      "A small, made-to-order gift that travels everywhere.",
    image: "/images/products/personalized-name-keychain.jpg",
  },
  {
    slug: "custom",
    name: "Custom Projects",
    tagline: "Keepsakes, carvings & one-of-a-kind work",
    description:
      "The pieces that don't fit a category — carved shadow boxes, layered wall art, bottle openers, candle caddies, " +
      "and whatever you can dream up. If it's made of wood, we'll build it.",
    image: "/images/products/love-rose-shadow-box.jpg",
  },
];

export const products: Product[] = [
  // ---- Tables ----
  {
    slug: "farmhouse-console-table",
    name: "Farmhouse Console Table",
    category: "tables",
    image: "/images/products/farmhouse-console-table.jpg",
    alt: "Two-tone farmhouse console table with a dark plank top, chunky white base, and a lower display shelf",
    blurb:
      "A two-tone console with a dark stained top and a chunky white farmhouse base, plus a lower shelf for baskets and bins. Sits perfectly behind the couch or as an entryway catch-all.",
    priceCents: 24900, // PLACEHOLDER
    personalization: "Tell us your length, base paint color, and top stain",
    details: {
      sizeNote: "Built to your length",
      woodNote: "Solid pine",
      finishNote: "Stained top, base painted any color",
    },
    featured: true,
  },
  {
    slug: "coffee-bar-buffet-table",
    name: "Coffee Bar Buffet Table",
    category: "tables",
    image: "/images/products/coffee-bar-buffet-table.jpg",
    alt: "Long two-tone buffet table styled as a coffee bar, with a dark plank top, white base, and full lower shelf",
    blurb:
      "A long, sturdy buffet built to anchor a coffee bar or dining-room serving station — dark plank top over a white base with a full lower shelf for all your gear. Made to your wall.",
    priceCents: 32900, // PLACEHOLDER
    personalization: "Tell us your length, base paint color, and top stain",
    details: {
      sizeNote: "Up to 7 ft and beyond",
      woodNote: "Solid pine",
      finishNote: "Stained top, base painted any color",
    },
  },

  // ---- Shelves ----
  {
    slug: "corner-shelf-desk-unit",
    name: "X-Frame Corner Shelf & Desk",
    category: "shelves",
    image: "/images/products/corner-shelf-desk-unit.jpg",
    alt: "White X-frame corner shelving towers flanking a built-in stained desk surface",
    blurb:
      "A space-saving corner unit — tall X-frame towers framing a built-in desk or display surface. Made for a home-office nook or a tucked-away reading corner.",
    priceCents: 18900, // PLACEHOLDER
    personalization: "Your corner's dimensions, plus frame & stain colors",
    details: {
      sizeNote: "Sized to fit your corner",
      woodNote: "Painted pine with a stained top",
      finishNote: "White frame, stained work surface",
    },
    featured: true,
  },
  {
    slug: "mountain-peak-shelf",
    name: "Mountain Peak Shelf",
    category: "shelves",
    image: "/images/products/mountain-peak-shelf.jpg",
    alt: "Triangular mountain-range wall shelf in torched wood with snow-capped peaks, open cubbies, and a row of key hooks below",
    blurb:
      "A trio of torched-wood peaks with snowy caps, open cubbies for trinkets, and a row of hooks underneath for keys and leashes. A rugged little catch-all for the entryway or cabin.",
    priceCents: 6900, // PLACEHOLDER
    personalization: "Any stain or finish preferences? (optional)",
    details: {
      sizeNote: "About 24 in wide",
      woodNote: "Torched pine",
      finishNote: "Burnt & sealed, snow-tipped peaks",
    },
    featured: true,
  },

  // ---- Signs ----
  {
    slug: "welcome-porch-frame",
    name: "Welcome Porch Frame",
    category: "signs",
    image: "/images/products/welcome-porch-frame.jpg",
    alt: "Torched-wood standing Welcome frame cradling a hanging basket of pansies on a stone patio",
    blurb:
      "A torched-finish standing frame built to cradle a hanging basket or wreath, topped with a carved “Welcome.” A warm hello by the front door in every season.",
    priceCents: 8900, // PLACEHOLDER
    personalization: "Word or name to carve (e.g. “Welcome” or a family name)",
    details: {
      sizeNote: "Porch / entry size",
      woodNote: "Torched pine",
      finishNote: "Burnt & sealed; your word or name carved in",
    },
  },
  {
    slug: "bikers-prayer-plaque",
    name: "Biker's Prayer Plaque",
    category: "signs",
    image: "/images/products/bikers-prayer-plaque.jpg",
    alt: "Engraved wood plaque with a cruiser motorcycle and the full Biker's Prayer inside a routed border",
    blurb:
      "The full Biker's Prayer engraved deep into the grain beneath a cruiser, wrapped in a routed border. A heartfelt gift for the rider in the family.",
    priceCents: 4900, // PLACEHOLDER
    personalization: "Add a name, or swap in a different prayer? (optional)",
    details: {
      sizeNote: "Wall / shelf size",
      woodNote: "Stained hardwood",
      finishNote: "Engraved; swap in any prayer or name",
    },
    featured: true,
  },
  {
    slug: "bikers-prayer-cross",
    name: "Biker's Prayer Cross",
    category: "signs",
    image: "/images/products/bikers-prayer-cross.jpg",
    alt: "Cross-shaped layered wood plaque with the Biker's Prayer cut into the silhouette",
    blurb:
      "The same prayer, this time cut and layered into the shape of a cross — the words form the whole piece. A striking faith-and-the-road keepsake.",
    priceCents: 4900, // PLACEHOLDER
    personalization: "Add a name, or use different text? (optional)",
    details: {
      sizeNote: "Wall size",
      woodNote: "Layered birch",
      finishNote: "Two-tone cut; your text optional",
    },
  },
  {
    slug: "team-pride-paw-plaque",
    name: "Team Pride Paw Plaque",
    category: "signs",
    image: "/images/products/team-pride-paw-plaque.jpg",
    alt: "Rustic torched-wood frame around a bright painted team paw print",
    blurb:
      "A framed, painted team-pride paw in your colors, set in a rustic torched frame. Game-day decor for the porch, den, or man cave — send us your team.",
    priceCents: 4500, // PLACEHOLDER
    personalization: "Which team, mascot, and colors?",
    personalizationRequired: true,
    details: {
      sizeNote: "Wall plaque",
      woodNote: "Framed pine",
      finishNote: "Painted in your team's colors",
    },
  },
  {
    slug: "home-state-pride-sign",
    name: "Home State Pride Sign",
    category: "signs",
    image: "/images/products/home-state-pride-sign.jpg",
    alt: "Standing white HOME sign with a state silhouette and a palmetto-and-moon worked into the lettering, seated in a planter-style base",
    blurb:
      "A standing “HOME” sign with your state's shape and an icon worked right into the lettering, seated in a little planter-style base. Tell us your state and we'll make it yours.",
    priceCents: 3900, // PLACEHOLDER
    personalization: "Which state, and the icon/wording to feature",
    personalizationRequired: true,
    details: {
      sizeNote: "Tabletop standing sign",
      woodNote: "Painted pine with cut overlay",
      finishNote: "Your state & emblem",
    },
  },
  {
    slug: "not-today-heifer-round",
    name: "“Not Today Heifer” Round Sign",
    category: "signs",
    image: "/images/products/not-today-heifer-round.jpg",
    alt: "Round white sign with a painted cow holding a sunflower, ringed by a green laurel wreath, reading Not Today Heifer",
    blurb:
      "Our sassiest seller — a painted heifer with a sunflower in her teeth, framed by a leafy wreath. “Not Today Heifer.” Want different words? We'll letter your own.",
    priceCents: 3900, // PLACEHOLDER
    personalization: "Use different wording? Tell us what to letter (optional)",
    details: {
      sizeNote: "Round wall sign",
      woodNote: "Painted birch",
      finishNote: "Hand-painted; your saying optional",
    },
    featured: true,
  },
  {
    slug: "not-today-heifer-framed",
    name: "“Not Today Heifer” Framed Art",
    category: "signs",
    image: "/images/products/not-today-heifer-framed.jpg",
    alt: "Chunky rustic dark-wood frame around an engraved cow with a sunflower, reading Not Today Heifer",
    blurb:
      "The heifer again, this time engraved into light wood and set in a chunky rustic frame with corner accents. A farmhouse-wall favorite.",
    priceCents: 4900, // PLACEHOLDER
    personalization: "Use different wording? Tell us what to letter (optional)",
    details: {
      sizeNote: "Framed wall art",
      woodNote: "Engraved maple, stained frame",
      finishNote: "Engraved; personalize the text",
    },
  },
  {
    slug: "not-today-heifer-elegant",
    name: "“Not Today Heifer” Elegant Sign",
    category: "signs",
    image: "/images/products/not-today-heifer-elegant.jpg",
    alt: "Engraved cow with a sunflower inside an ornate cut-scroll border, reading Not Today Heifer",
    blurb:
      "The dressy version — the same cheeky heifer wrapped in a delicate cut-scroll border. The fancy way to tell the world it's not today.",
    priceCents: 4500, // PLACEHOLDER
    personalization: "Use different wording? Tell us what to letter (optional)",
    details: {
      sizeNote: "Wall sign",
      woodNote: "Engraved & cut birch",
      finishNote: "Scrollwork border; your wording",
    },
  },

  // ---- Keychains ----
  {
    slug: "bikers-prayer-keychain",
    name: "Biker's Prayer Keychain",
    category: "keychains",
    image: "/images/products/bikers-prayer-keychain.jpg",
    alt: "Rectangular hardwood keychain engraved with the Biker's Prayer on a split ring",
    blurb:
      "The Biker's Prayer shrunk down to ride along — engraved on a smooth hardwood fob with a sturdy split ring. A small gift that means a lot.",
    priceCents: 1500, // PLACEHOLDER
    personalization: "Add a name or initials to the back? (optional)",
    details: {
      sizeNote: "Pocket keychain",
      woodNote: "Beech",
      finishNote: "Engraved; back side optional",
    },
  },
  {
    slug: "personalized-name-keychain",
    name: "Personalized Name Keychain",
    category: "keychains",
    image: "/images/products/personalized-name-keychain.jpg",
    alt: "Square hardwood keychain engraved with the name GiGi and a scatter of small hearts",
    blurb:
      "A clean little square fob engraved with a name, monogram, or date — hearts and accents optional. (Shown: “GiGi.”) Tell us the name and we'll burn it in.",
    priceCents: 1500, // PLACEHOLDER
    personalization: "Name, monogram, or date to engrave (e.g. “GiGi”)",
    personalizationRequired: true,
    details: {
      sizeNote: "Square keychain",
      woodNote: "Beech",
      finishNote: "Your name / monogram engraved",
    },
    featured: true,
  },

  // ---- Custom Projects ----
  {
    slug: "love-rose-shadow-box",
    name: "Carved Rose “Love” Shadow Box",
    category: "custom",
    image: "/images/products/love-rose-shadow-box.jpg",
    alt: "Hinged wood shadow box with a layered carved red rose and the word love behind a heart-cut lattice lid",
    blurb:
      "A hinged keepsake box with a layered carved rose and a heart-cut lattice lid. A romantic gift for an anniversary, Valentine's, or a “just because.”",
    priceCents: 5900, // PLACEHOLDER
    personalization: "Add a name or date? (optional)",
    details: {
      sizeNote: "Keepsake box",
      woodNote: "Layered hardwood",
      finishNote: "Carved rose; add a name or date",
    },
    featured: true,
  },
  {
    slug: "colored-forest-wall-art",
    name: "Layered Forest Wall Art — Color",
    category: "custom",
    image: "/images/products/colored-forest-wall-art.jpg",
    alt: "Framed layered-wood forest scene with orange and tan pines on a deep blue background, a bear and a deer in silhouette",
    blurb:
      "A deep layered-wood forest with a bear and a deer slipping between the pines, lit up in warm autumn color over a moody blue. A statement piece for a cabin or den.",
    priceCents: 9900, // PLACEHOLDER
    personalization: "Any size or color preferences? (optional)",
    details: {
      sizeNote: "Framed wall art",
      woodNote: "Layered cut wood",
      finishNote: "Color layers; horizontal frame",
    },
  },
  {
    slug: "dark-forest-wall-art",
    name: "Layered Forest Wall Art — Natural",
    category: "custom",
    image: "/images/products/dark-forest-wall-art.jpg",
    alt: "Framed layered-wood forest scene in natural wood tones with a bear and deer among the pines",
    blurb:
      "The same dimensional forest in all-natural wood tones — quieter, warmer, all grain and shadow. Bear and deer included; sized to your wall.",
    priceCents: 9900, // PLACEHOLDER
    personalization: "Any size or stain preferences? (optional)",
    details: {
      sizeNote: "Framed wall art",
      woodNote: "Layered natural wood",
      finishNote: "Stained tones; horizontal frame",
    },
  },
  {
    slug: "shriners-wood-slice-plaques",
    name: "Wood-Slice Emblem Plaque Set",
    category: "custom",
    image: "/images/products/shriners-wood-slice-plaques.jpg",
    alt: "Pair of bark-edged wood-slice plaques wood-burned with a crescent, scimitar, and star fraternal emblem",
    blurb:
      "A matched pair of live-edge wood slices burned with a fraternal emblem or crest. Great for a lodge wall or a member's gift — send us the emblem for your order.",
    priceCents: 5900, // PLACEHOLDER
    personalization: "Which emblem or crest should we burn in?",
    personalizationRequired: true,
    details: {
      sizeNote: "Live-edge slices",
      woodNote: "Natural pine rounds",
      finishNote: "Wood-burned; your emblem or crest",
    },
  },
  {
    slug: "team-pride-bottle-opener",
    name: "Team Pride Wall Bottle Opener",
    category: "custom",
    image: "/images/products/team-pride-bottle-opener.jpg",
    alt: "Torched-wood wall-mounted bottle opener with a painted team mascot and a cap-catching box below",
    blurb:
      "A wall-mount cast opener over a torched board, with a cap-catcher box and your team's mascot painted on. Bottoms up in the garage bar or man cave.",
    priceCents: 4900, // PLACEHOLDER
    personalization: "Which team, mascot, and colors?",
    personalizationRequired: true,
    details: {
      sizeNote: "Wall mount",
      woodNote: "Torched pine + cast opener",
      finishNote: "Your team / mascot painted",
    },
  },
  {
    slug: "take-your-top-off-bottle-opener",
    name: "“Take Your Top Off” Bottle Opener",
    category: "custom",
    image: "/images/products/take-your-top-off-bottle-opener.jpg",
    alt: "Torched-wood wall bottle opener engraved Go Ahead Take Your Top Off with a cap-catching box",
    blurb:
      "The same sturdy wall opener and cap-catcher, engraved with a wink — “Go ahead, take your top off.” A guaranteed grin for the home bar; we'll swap in your own line.",
    priceCents: 4900, // PLACEHOLDER
    personalization: "Use your own line? Type it here (optional)",
    details: {
      sizeNote: "Wall mount",
      woodNote: "Torched pine + cast opener",
      finishNote: "Engraved; your wording optional",
    },
  },
  {
    slug: "little-pecker-club-coasters",
    name: "“Little Pecker Club” Coaster Set",
    category: "custom",
    image: "/images/products/little-pecker-club-coasters.jpg",
    alt: "Stacked square wood coasters engraved with a sunglasses-wearing bird reading Little Pecker Club, Lil Gents Makin Dents",
    blurb:
      "A cheeky engraved coaster set — a shades-wearing little bird and the “Little Pecker Club” crest. A gag gift that actually protects the table; personalize the bottom line.",
    priceCents: 3500, // PLACEHOLDER
    personalization: "Personalize the bottom line / club name? (optional)",
    details: {
      sizeNote: "Set of 4–6",
      woodNote: "Engraved hardwood",
      finishNote: "Engraved; your club name optional",
    },
  },
  {
    slug: "personalized-candle-caddy",
    name: "Personalized Candle Caddy",
    category: "custom",
    image: "/images/products/personalized-candle-caddy.jpg",
    alt: "Engraved wood candle caddy holding four glass votives, with a family name, carved hearts, and rope handles",
    blurb:
      "An engraved caddy cradling a row of glass votives, personalized with your family name and finished with rope handles for the table or mantel. (Shown: “Beasley's.”)",
    priceCents: 4500, // PLACEHOLDER
    personalization: "Family name to engrave (e.g. “Beasley's”)",
    personalizationRequired: true,
    details: {
      sizeNote: "Holds 4 votives",
      woodNote: "Stained oak",
      finishNote: "Engraved name; votives included",
    },
  },
  {
    slug: "lucky-duck-keepsake-tag",
    name: "“One Lucky Duck” Keepsake Tag",
    category: "custom",
    image: "/images/products/lucky-duck-keepsake-tag.jpg",
    alt: "Arched wood gift tag engraved with a party-hat duck and a balloon, reading thank you for making me one lucky duck, love Colten",
    blurb:
      "An arched, hangable keepsake tag — a party-hat duck and a sweet thank-you, fully personalized. (Shown: “one lucky duck, love Colten.”) A heartfelt little gift for a favorite person.",
    priceCents: 2500, // PLACEHOLDER
    personalization: "Names & message (e.g. “one lucky duck, love Colten”)",
    personalizationRequired: true,
    details: {
      sizeNote: "Hangable tag",
      woodNote: "Engraved birch",
      finishNote: "Your names & message engraved",
    },
  },
];

// ---- Helpers ----

/** Format a cents amount as USD, e.g. 4900 -> "$49". Drops the ".00" on whole dollars. */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? `$${dollars.toLocaleString("en-US")}`
    : `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

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
