/**
 * Canonical category taxonomy: 15 top-level categories, at most one level of
 * subcategories. Shared by prisma/seed.ts and scripts/restructure-categories.ts
 * so a fresh seed and a migrated production DB end up with the same shape.
 *
 * Slugs are permanent (they live in /marketplace?category= links); only
 * names, descriptions and parents may change. Arabic labels live in
 * CATEGORY_LABELS_AR (demo-content.ts) since Category has a single name column.
 *
 * Top-level order here is the homepage tie-break order.
 */
export type CategoryDefinition = {
  slug: string;
  name: string;
  description: string;
  children?: Array<Omit<CategoryDefinition, "children">>;
};

export const CATEGORY_TREE: CategoryDefinition[] = [
  { slug: "electronics", name: "Electronics", description: "Phones, laptops, tablets, and accessories." },
  {
    slug: "photography",
    name: "Photography & Production",
    description: "Cameras, lenses, and production equipment.",
    children: [
      { slug: "camera-lenses", name: "Camera Lenses", description: "Prime and zoom lens assets." },
      { slug: "professional-equipment", name: "Professional Equipment", description: "Industry-grade production tools and systems." }
    ]
  },
  {
    slug: "gaming",
    name: "Gaming",
    description: "Consoles, PCs, VR, and peripherals.",
    children: [{ slug: "gaming-consoles", name: "Gaming Consoles", description: "Console systems and bundles." }]
  },
  {
    slug: "vehicles",
    name: "Vehicles",
    description: "Cars and motorcycles for rent or swap.",
    children: [
      { slug: "cars", name: "Cars", description: "Car rental and temporary usage listings." },
      { slug: "motorcycles", name: "Motorcycles", description: "Motorbike rental and swap listings." }
    ]
  },
  {
    slug: "weddings-events",
    name: "Weddings & Events",
    description: "Wedding essentials, bridal wear, and event gear.",
    children: [
      { slug: "wedding-dresses", name: "Wedding Dresses", description: "Bridal dresses and accessories." },
      { slug: "wedding", name: "Weddings", description: "Wedding assets and event essentials." },
      { slug: "event-equipment", name: "Event Equipment", description: "Audio, lighting, and staging gear." }
    ]
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    description: "Property and hospitality assets.",
    children: [
      { slug: "apartments", name: "Apartments", description: "Apartments for short and long stays." },
      { slug: "chalets", name: "Chalets", description: "Beach and resort chalets." }
    ]
  },
  {
    slug: "tools-construction",
    name: "Tools & Construction",
    description: "Power tools and construction equipment.",
    children: [
      { slug: "power-tools", name: "Power Tools", description: "Drills, saws, and concrete tools." },
      { slug: "construction", name: "Construction", description: "Heavy and light construction tools." }
    ]
  },
  {
    slug: "sports-outdoors",
    name: "Sports & Outdoors",
    description: "Sports gear, camping, and trips.",
    children: [
      { slug: "camping", name: "Camping", description: "Outdoor, camping, and travel gear." },
      { slug: "sports", name: "Sports", description: "Fitness and sports equipment." },
      { slug: "experiences", name: "Experiences", description: "Experience and trip-ready bundles." }
    ]
  },
  {
    slug: "music-dj",
    name: "Music & DJ",
    description: "Instruments, DJ decks, and PA systems.",
    children: [
      { slug: "musical-instruments", name: "Musical Instruments", description: "Instruments, amps, and studio tools." },
      { slug: "dj-systems", name: "DJ Systems", description: "Mixers, decks, and PA sets." }
    ]
  },
  { slug: "fashion", name: "Fashion", description: "Designer items, costumes, and occasion wear." },
  { slug: "furniture", name: "Furniture", description: "Home and office furniture assets." },
  { slug: "services", name: "Services", description: "Bookable service-oriented assets." },
  { slug: "kids", name: "Kids", description: "Kids toys, strollers, and child accessories." },
  { slug: "pets", name: "Pets", description: "Pet accessories and care equipment." },
  { slug: "books", name: "Books", description: "Educational and collectible books." }
];

/** Top-level slugs in homepage tie-break order. */
export const TOP_LEVEL_CATEGORY_ORDER: string[] = CATEGORY_TREE.map((category) => category.slug);
