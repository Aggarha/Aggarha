import {
  PrismaClient,
  BookingStatus,
  DealStatus,
  ListingMode,
  ListingStatus,
  ListingVisibility,
  VerificationLevel,
  UserRole,
  AvailabilityDateStatus,
  FraudReportStatus,
  Prisma
} from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

/** Every seeded user shares this password so demo/review accounts are actually usable for login testing. */
const SEED_TEST_PASSWORD = "Test1234!";

type CategorySeed = {
  slug: string;
  name: string;
  description: string;
  parentSlug?: string;
};

type EgyptLocationSeed = {
  country: string;
  governorate: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
};

const categories: CategorySeed[] = [
  { slug: "electronics", name: "Electronics", description: "Phones, laptops, tablets, and accessories." },
  { slug: "gaming", name: "Gaming", description: "Consoles, PCs, VR, and peripherals." },
  { slug: "photography", name: "Photography", description: "Cameras, lenses, and production accessories." },
  { slug: "furniture", name: "Furniture", description: "Home and office furniture assets." },
  { slug: "cars", name: "Cars", description: "Car rental and temporary usage listings." },
  { slug: "motorcycles", name: "Motorcycles", description: "Motorbike rental and swap listings." },
  { slug: "fashion", name: "Fashion", description: "Designer items, costumes, and occasion wear." },
  { slug: "wedding", name: "Wedding", description: "Wedding assets and event essentials." },
  { slug: "kids", name: "Kids", description: "Kids toys, strollers, and child accessories." },
  { slug: "camping", name: "Camping", description: "Outdoor, camping, and travel gear." },
  { slug: "sports", name: "Sports", description: "Fitness and sports equipment." },
  { slug: "construction", name: "Construction", description: "Heavy and light construction tools." },
  { slug: "professional-equipment", name: "Professional Equipment", description: "Industry-grade tools and systems." },
  { slug: "event-equipment", name: "Event Equipment", description: "Audio, lighting, and staging gear." },
  { slug: "musical-instruments", name: "Musical Instruments", description: "Instruments, amps, and studio tools." },
  { slug: "books", name: "Books", description: "Educational and collectible books." },
  { slug: "pets", name: "Pets", description: "Pet accessories and care equipment." },
  { slug: "real-estate", name: "Real Estate", description: "Property and hospitality assets." },
  { slug: "services", name: "Services", description: "Bookable service-oriented assets.", parentSlug: "professional-equipment" },
  { slug: "experiences", name: "Experiences", description: "Experience and event-ready bundles.", parentSlug: "event-equipment" },
  { slug: "gaming-consoles", name: "Gaming Consoles", description: "Console systems and bundles.", parentSlug: "gaming" },
  { slug: "camera-lenses", name: "Camera Lenses", description: "Prime and zoom lens assets.", parentSlug: "photography" },
  { slug: "wedding-dresses", name: "Wedding Dresses", description: "Bridal dresses and accessories.", parentSlug: "wedding" },
  { slug: "dj-systems", name: "DJ Systems", description: "Mixers, decks, and PA sets.", parentSlug: "event-equipment" },
  { slug: "power-tools", name: "Power Tools", description: "Drills, saws, and concrete tools.", parentSlug: "construction" }
];

const egyptLocations: EgyptLocationSeed[] = [
  { country: "Egypt", governorate: "Cairo", city: "Cairo", district: "Nasr City", latitude: 30.0665, longitude: 31.3068 },
  { country: "Egypt", governorate: "Cairo", city: "Cairo", district: "Maadi", latitude: 29.9619, longitude: 31.2569 },
  { country: "Egypt", governorate: "Giza", city: "Giza", district: "Dokki", latitude: 30.0384, longitude: 31.2101 },
  { country: "Egypt", governorate: "Giza", city: "6th of October", district: "First District", latitude: 29.9716, longitude: 30.9445 },
  { country: "Egypt", governorate: "Alexandria", city: "Alexandria", district: "Smouha", latitude: 31.2058, longitude: 29.9245 },
  { country: "Egypt", governorate: "Alexandria", city: "Alexandria", district: "Stanley", latitude: 31.2440, longitude: 29.9662 },
  { country: "Egypt", governorate: "Dakahlia", city: "Mansoura", district: "Toril", latitude: 31.0409, longitude: 31.3785 },
  { country: "Egypt", governorate: "Sharqia", city: "Zagazig", district: "El Qawmia", latitude: 30.5877, longitude: 31.5020 },
  { country: "Egypt", governorate: "Monufia", city: "Shebin El Kom", district: "Qebly", latitude: 30.5526, longitude: 31.0120 },
  { country: "Egypt", governorate: "Beheira", city: "Damanhur", district: "Shubra", latitude: 31.0341, longitude: 30.4682 },
  { country: "Egypt", governorate: "Port Said", city: "Port Said", district: "El Arab", latitude: 31.2653, longitude: 32.3019 },
  { country: "Egypt", governorate: "Suez", city: "Suez", district: "El Arbaeen", latitude: 29.9668, longitude: 32.5498 },
  { country: "Egypt", governorate: "Ismailia", city: "Ismailia", district: "Sheikh Zayed", latitude: 30.5903, longitude: 32.2715 },
  { country: "Egypt", governorate: "Red Sea", city: "Hurghada", district: "El Kawther", latitude: 27.2579, longitude: 33.8116 },
  { country: "Egypt", governorate: "South Sinai", city: "Sharm El Sheikh", district: "Naama Bay", latitude: 27.9158, longitude: 34.3299 },
  { country: "Egypt", governorate: "Luxor", city: "Luxor", district: "East Bank", latitude: 25.6872, longitude: 32.6396 },
  { country: "Egypt", governorate: "Aswan", city: "Aswan", district: "Aswan City", latitude: 24.0889, longitude: 32.8998 },
  { country: "Egypt", governorate: "Assiut", city: "Assiut", district: "El Hamra", latitude: 27.1809, longitude: 31.1837 },
  { country: "Egypt", governorate: "Sohag", city: "Sohag", district: "El Kawsar", latitude: 26.5560, longitude: 31.6948 },
  { country: "Egypt", governorate: "Qalyubia", city: "Banha", district: "El Ahram", latitude: 30.4660, longitude: 31.1848 }
];

const listingTitles = [
  "PlayStation 5 Digital + Extra Controller",
  "Xbox Series X Night Bundle",
  "Nintendo Switch OLED Mario Edition",
  "Sony A7 IV Body + 24-70 Lens",
  "Canon R6 Mark II Wedding Kit",
  "Nikon Z6 II Creator Pack",
  "DJI Ronin-S Gimbal Pro",
  "GoPro Hero 12 Adventure Set",
  "MacBook Pro M2 for Editing",
  "Lenovo Legion Gaming Laptop",
  "iPad Pro 12.9 Design Bundle",
  "Portable Podcast Studio Rack",
  "Pioneer DDJ-FLX6 DJ Controller",
  "Rode NT1 Podcast Mic Pair",
  "Yamaha Stage Keyboard 88",
  "Full Wedding Lighting Kit",
  "Wireless Uplight Pack x8",
  "Pro Event Speaker Pair 2000W",
  "Inflatable Outdoor Cinema Set",
  "Camping Tent 6 Persons Deluxe",
  "Mountain Bike Trek Fuel EX",
  "Professional Treadmill Nordic",
  "Home Gym Adjustable Bench",
  "Baby Stroller Travel System",
  "Luxury Bridal Dress A-Line",
  "Designer Evening Gown Emerald",
  "Men's Tuxedo Premium Fit",
  "Kids Birthday Bouncy Castle",
  "Bosch Concrete Drill Set",
  "Makita Circular Saw Kit",
  "Portable Welding Machine",
  "Scaffolding Tower 6M",
  "Toyota Corolla 2023 Daily Rental",
  "Hyundai Elantra 2022 City Ride",
  "Nissan Sunny 2021 Economy",
  "Yamaha R3 Sport Bike",
  "Honda CBR500R Weekend",
  "Pet Grooming Professional Table",
  "Bird Cage Luxury Large",
  "Aquarium Setup 200L Complete",
  "Kindle Paperwhite Library Pack",
  "Medical Exam Bed Adjustable",
  "Beauty Clinic Laser Device",
  "Conference Room AV Package",
  "Projector 4K Business Pack",
  "Drone DJI Mini 4 Pro",
  "Full Photography Studio Lights",
  "Road Bike Carbon Elite",
  "Padel Rackets Tournament Set",
  "Kayak Single Pro Ocean",
  "Snow Foam Car Wash Kit",
  "Gaming Chair Ergonomic Pro",
  "Professional Barber Station",
  "Food Truck Pop-up Setup",
  "Portable AC Unit 2 Ton"
];

const placeholderImages = [
  "https://picsum.photos/seed/aggarha-1/960/640",
  "https://picsum.photos/seed/aggarha-2/960/640",
  "https://picsum.photos/seed/aggarha-3/960/640",
  "https://picsum.photos/seed/aggarha-4/960/640",
  "https://picsum.photos/seed/aggarha-5/960/640",
  "https://picsum.photos/seed/aggarha-6/960/640",
  "https://picsum.photos/seed/aggarha-7/960/640",
  "https://picsum.photos/seed/aggarha-8/960/640"
];

function pick<T>(arr: T[], idx: number): T {
  return arr[idx % arr.length];
}

function decimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function randomStatus(index: number): ListingStatus {
  const statuses: ListingStatus[] = [
    ListingStatus.PUBLISHED,
    ListingStatus.PUBLISHED,
    ListingStatus.PUBLISHED,
    ListingStatus.RESERVED,
    ListingStatus.RENTED,
    ListingStatus.SWAPPED,
    ListingStatus.COMPLETED,
    ListingStatus.PENDING_REVIEW,
    ListingStatus.EXPIRED,
    ListingStatus.DRAFT
  ];
  return pick(statuses, index);
}

function randomVisibility(index: number): ListingVisibility {
  const visibilities: ListingVisibility[] = [
    ListingVisibility.PUBLIC,
    ListingVisibility.PUBLIC,
    ListingVisibility.FEATURED,
    ListingVisibility.BOOSTED,
    ListingVisibility.PUBLIC,
    ListingVisibility.PRIVATE,
    ListingVisibility.HIDDEN
  ];
  return pick(visibilities, index);
}

function randomMode(index: number): ListingMode {
  const modes: ListingMode[] = [ListingMode.RENT, ListingMode.SWAP, ListingMode.BOTH];
  return pick(modes, index);
}

async function clearDatabase() {
  await prisma.rateLimitEvent.deleteMany();
  await prisma.suspiciousUserSignal.deleteMany();
  await prisma.duplicateListingSignal.deleteMany();
  await prisma.fraudReport.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.savedListing.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilityDate.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();
  await prisma.category.deleteMany();
}

/**
 * Profile identity now drives every owner name in the UI — cards, quick-view,
 * detail page, profile page all read Profile.displayName. Previously the UI
 * hashed a name out of the owner id while the seed wrote "Aggarha Seller N",
 * so a card and the profile behind it disagreed. Names live here, once.
 *
 * Handles are derived from the names and hand-checked unique, so a seeded
 * profile URL reads like /u/ahmed-nabil rather than /u/aggarha-user-1.
 */
const seedProfiles = [
  { handle: "ahmed-nabil", displayName: "Ahmed Nabil", bio: "Camera gear I actually use. Ask me anything before you book." },
  { handle: "mona-farouk", displayName: "Mona Farouk", bio: "Renting out what sits idle. Fast replies, Maadi pickup." },
  { handle: "youssef-adel", displayName: "Youssef Adel", bio: "Audio and studio kit. I test everything before handover." },
  { handle: "salma-ibrahim", displayName: "Salma Ibrahim", bio: "Swaps welcome. Mostly books, boards and camping gear." },
  { handle: "karim-elsayed", displayName: "Karim El-Sayed", bio: "Tools and power equipment. Weekend rates available." },
  { handle: "nour-hassan", displayName: "Nour Hassan", bio: "Collector. Happy to talk trades on anything retro." },
  { handle: "omar-zaki", displayName: "Omar Zaki", bio: "Drones and action cams. Licensed operator, Zamalek based." },
  { handle: "yasmin-adel", displayName: "Yasmin Adel", bio: "Event and party gear. Delivery across Cairo for larger orders." },
  { handle: "mostafa-ali", displayName: "Mostafa Ali", bio: "Bikes, scooters and spares. I keep everything serviced." },
  { handle: "heba-mahmoud", displayName: "Heba Mahmoud", bio: "Kitchen and catering equipment. Clean, counted, ready." },
  { handle: "amr-khaled", displayName: "Amr Khaled", bio: "Console and PC gaming. Swap-first, rent if you prefer." },
  { handle: "dina-samir", displayName: "Dina Samir", bio: "Photography lighting. I can set it up with you on site." },
  { handle: "tarek-youssef", displayName: "Tarek Youssef", bio: "Alexandria. Watersports and beach gear through summer." },
  { handle: "rania-fathy", displayName: "Rania Fathy", bio: "Designer pieces for occasions. Dry-cleaned between bookings." },
  { handle: "hassan-farid", displayName: "Hassan Farid", bio: "Site and survey instruments. Deposit required, no exceptions." },
  { handle: "mariam-sobhy", displayName: "Mariam Sobhy", bio: "Musical instruments. Beginners very welcome to ask first." }
];

async function main() {
  await clearDatabase();

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const parentId = category.parentSlug ? categoryMap.get(category.parentSlug) : undefined;
    const created = await prisma.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        parentId
      }
    });
    categoryMap.set(category.slug, created.id);
  }

  const locationRecords = await Promise.all(
    egyptLocations.map((loc) =>
      prisma.location.create({
        data: {
          country: loc.country,
          governorate: loc.governorate,
          city: loc.city,
          district: loc.district,
          latitude: decimal(loc.latitude),
          longitude: decimal(loc.longitude),
          searchRadiusKm: 15,
          formattedAddress: `${loc.district}, ${loc.city}, ${loc.governorate}, ${loc.country}`
        }
      })
    )
  );

  const seedPasswordHash = await hashPassword(SEED_TEST_PASSWORD);

  const users = [] as Array<{ id: string; trustScore: number; level: number; verification: VerificationLevel }>;
  for (let i = 0; i < seedProfiles.length; i += 1) {
    const trustScore = 55 + (i % 9) * 4.2;
    const level = 2 + (i % 10);
    const verification = pick(
      [
        VerificationLevel.PHONE_VERIFIED,
        VerificationLevel.EMAIL_VERIFIED,
        VerificationLevel.ID_VERIFIED,
        VerificationLevel.BUSINESS_VERIFIED,
        VerificationLevel.PROFESSIONAL_SELLER
      ],
      i
    );

    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@aggarha.eg`,
        phone: `+201000000${(100 + i).toString().slice(-3)}`,
        passwordHash: seedPasswordHash,
        role: i < 5 ? UserRole.RESELLER : UserRole.USER,
        verificationLevel: verification,
        emailVerifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (40 + i)),
        phoneVerifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (60 + i)),
        idVerifiedAt: verification === VerificationLevel.ID_VERIFIED || verification === VerificationLevel.BUSINESS_VERIFIED || verification === VerificationLevel.PROFESSIONAL_SELLER ? new Date() : null,
        businessVerifiedAt: verification === VerificationLevel.BUSINESS_VERIFIED ? new Date() : null,
        professionalSellerVerifiedAt: verification === VerificationLevel.PROFESSIONAL_SELLER ? new Date() : null,
        trustScore: decimal(trustScore),
        trustTier: Math.min(4, Math.floor(trustScore / 20)),
        xp: 180 * level,
        level,
        responseRate: decimal(72 + (i % 7) * 3.1),
        responseSpeedMinutes: 8 + i * 2,
        cancellationRate: decimal(1 + (i % 5) * 1.2),
        accountAgeDays: 120 + i * 27,
        fraudReportsCount: i % 4,
        aiFraudScore: decimal(8 + i * 1.1),
        profile: {
          create: {
            handle: seedProfiles[i].handle,
            displayName: seedProfiles[i].displayName,
            bio: seedProfiles[i].bio,
            city: pick(locationRecords, i).city,
            country: "Egypt",
            responseRate: decimal(74 + (i % 5) * 4),
            completionRate: decimal(80 + (i % 6) * 2.5),
            successfulDeals: 5 + i,
            failedDeals: i % 3,
            reviewCount: 2 + i,
            averageRating: decimal(3.9 + (i % 5) * 0.2)
          }
        }
      }
    });

    users.push({ id: user.id, trustScore, level, verification });
  }

  // Asymmetric follow graph: each user follows a cyclic run of 2-6 others, and
  // the first three users additionally collect followers from most of the set.
  // Asymmetry is the point — a symmetric graph would make every profile show
  // identical Following and Followers counts, which reads as placeholder data.
  const followEdges: Array<{ followerId: string; followingId: string }> = [];
  for (let i = 0; i < users.length; i += 1) {
    const runLength = 2 + (i % 5);
    for (let step = 1; step <= runLength; step += 1) {
      followEdges.push({
        followerId: users[i].id,
        followingId: users[(i + step) % users.length].id
      });
    }
    for (const popularIndex of [0, 1, 2]) {
      if (i !== popularIndex && (i + popularIndex) % 2 === 0) {
        followEdges.push({ followerId: users[i].id, followingId: users[popularIndex].id });
      }
    }
  }
  await prisma.follow.createMany({
    data: followEdges.filter((edge) => edge.followerId !== edge.followingId),
    skipDuplicates: true
  });

  const categoryIds = Array.from(categoryMap.values());

  const listings = [] as Array<{ id: string; ownerId: string }>;
  for (let i = 0; i < 55; i += 1) {
    const owner = pick(users, i);
    const location = pick(locationRecords, i);
    const categoryId = pick(categoryIds, i);
    const status = randomStatus(i);
    const visibility = randomVisibility(i);
    const mode = randomMode(i);
    const price = 250 + (i % 10) * 180;

    const listing = await prisma.listing.create({
      data: {
        title: pick(listingTitles, i),
        description:
          "Well-maintained asset with flexible booking options. Suitable for short-term rentals and trusted swaps across Egyptian cities.",
        ownerId: owner.id,
        categoryId,
        locationId: location.id,
        mode,
        status,
        visibility,
        quantity: 1 + (i % 3),
        priceAmount: decimal(price),
        currencyCode: "EGP",
        minRentalDays: 1 + (i % 3),
        maxRentalDays: 14 + (i % 16),
        preparationDays: i % 2,
        cooldownDays: i % 3,
        trustScoreSnapshot: decimal(owner.trustScore),
        ownerLevelSnapshot: owner.level,
        featuredUntil: visibility === ListingVisibility.FEATURED ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 20) : null,
        boostedUntil: visibility === ListingVisibility.BOOSTED ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 8) : null,
        publishedAt: status === ListingStatus.PUBLISHED || status === ListingStatus.RESERVED || status === ListingStatus.RENTED || status === ListingStatus.SWAPPED ? new Date(Date.now() - 1000 * 60 * 60 * 24 * (i % 30)) : null,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * (40 + (i % 40))),
        viewCount: 50 + i * 17,
        imageUrl: pick(placeholderImages, i)
      }
    });

    listings.push({ id: listing.id, ownerId: owner.id });

    for (let day = 0; day < 7; day += 1) {
      await prisma.availabilityRule.create({
        data: {
          listingId: listing.id,
          dayOfWeek: day,
          startHour: 9,
          endHour: 20,
          isAvailable: day !== 5,
          isRecurring: true
        }
      });
    }

    for (let d = 0; d < 20; d += 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + d);
      await prisma.availabilityDate.create({
        data: {
          listingId: listing.id,
          date,
          status: d % 9 === 0 ? AvailabilityDateStatus.BLOCKED : d % 7 === 0 ? AvailabilityDateStatus.RESERVED : AvailabilityDateStatus.AVAILABLE,
          notes: d % 9 === 0 ? "Owner maintenance window" : d % 7 === 0 ? "Reserved by pending booking" : null
        }
      });
    }
  }

  for (let i = 0; i < 18; i += 1) {
    const listing = pick(listings, i * 2);
    const requester = pick(users, i + 3);
    const owner = users.find((u) => u.id === listing.ownerId) ?? users[0];
    const startDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * (2 + i));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 2 + (i % 4));

    await prisma.booking.create({
      data: {
        listingId: listing.id,
        requesterId: requester.id,
        ownerId: owner.id,
        mode: ListingMode.RENT,
        status: pick([BookingStatus.REQUESTED, BookingStatus.APPROVED, BookingStatus.REJECTED, BookingStatus.COMPLETED], i),
        startDate,
        endDate,
        totalDays: Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))),
        requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)),
        approvedAt: i % 2 === 0 ? new Date(Date.now() - 1000 * 60 * 60 * 12) : null,
        ownerMessage: "Please share preferred pickup time.",
        requesterMessage: "Need this for a production weekend."
      }
    });
  }

  for (let i = 0; i < 22; i += 1) {
    const listing = pick(listings, i);
    const renter = pick(users, i + 4);
    const owner = users.find((u) => u.id === listing.ownerId) ?? users[0];

    const deal = await prisma.deal.create({
      data: {
        listingId: listing.id,
        initiatorId: renter.id,
        ownerId: owner.id,
        renterId: renter.id,
        status: pick([DealStatus.CONFIRMED, DealStatus.COMPLETED, DealStatus.DISPUTED], i),
        ownerConfirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (4 + i)),
        renterConfirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (4 + i)),
        completedAt: i % 3 === 0 ? new Date(Date.now() - 1000 * 60 * 60 * 24 * (2 + i)) : null,
        xpReleased: i % 3 === 0
      }
    });

    await prisma.review.create({
      data: {
        dealId: deal.id,
        listingId: listing.id,
        reviewerId: renter.id,
        revieweeId: owner.id,
        rating: 4 + (i % 2),
        comment: "Accurate listing, smooth handoff, and responsive owner.",
        trustImpact: decimal(1.1 + (i % 4) * 0.3),
        xpImpact: 20 + (i % 5) * 10
      }
    });
  }

  for (let i = 0; i < 30; i += 1) {
    await prisma.favorite.create({
      data: {
        userId: pick(users, i + 1).id,
        listingId: pick(listings, i).id
      }
    });
  }

  for (let i = 0; i < 28; i += 1) {
    await prisma.savedListing.create({
      data: {
        userId: pick(users, i + 2).id,
        listingId: pick(listings, i + 4).id
      }
    });
  }

  for (let i = 0; i < 14; i += 1) {
    await prisma.savedSearch.create({
      data: {
        userId: pick(users, i).id,
        name: `Egypt Search ${i + 1}`,
        keyword: i % 2 === 0 ? "camera" : "gaming",
        categorySlug: i % 2 === 0 ? "photography" : "gaming",
        governorate: pick(locationRecords, i).governorate,
        city: pick(locationRecords, i).city,
        district: pick(locationRecords, i).district,
        radiusKm: 15 + (i % 4) * 5,
        minPrice: decimal(200),
        maxPrice: decimal(3200),
        mode: pick([ListingMode.RENT, ListingMode.SWAP, ListingMode.BOTH], i),
        verifiedOnly: i % 3 === 0,
        minTrustScore: decimal(60 + (i % 4) * 5),
        minLevel: 3,
        sortBy: pick(["newest", "nearest", "featured", "most_trusted"], i)
      }
    });
  }

  for (let i = 0; i < 60; i += 1) {
    await prisma.recentlyViewed.create({
      data: {
        userId: pick(users, i + 3).id,
        listingId: pick(listings, i + 8).id,
        viewedAt: new Date(Date.now() - 1000 * 60 * (i * 25))
      }
    });
  }

  for (let i = 0; i < 12; i += 1) {
    await prisma.fraudReport.create({
      data: {
        reporterId: pick(users, i).id,
        targetUserId: pick(users, i + 5).id,
        listingId: pick(listings, i * 3).id,
        reason: pick(["Duplicate listing", "Suspicious pricing", "Identity mismatch", "Spam behavior"], i),
        details: "Automated and manual risk checks triggered this report.",
        status: pick([FraudReportStatus.OPEN, FraudReportStatus.UNDER_REVIEW, FraudReportStatus.CONFIRMED], i),
        aiScore: decimal(25 + i * 4)
      }
    });
  }

  for (let i = 0; i < 10; i += 1) {
    await prisma.duplicateListingSignal.create({
      data: {
        primaryListingId: pick(listings, i).id,
        suspectedListingId: pick(listings, i + 20).id,
        similarityScore: decimal(68 + i * 2.4)
      }
    });
  }

  for (let i = 0; i < users.length; i += 1) {
    await prisma.suspiciousUserSignal.create({
      data: {
        userId: pick(users, i + 1).id,
        signalType: pick(["velocity", "repeat_counterparty", "risk_device", "report_cluster"], i),
        severity: 1 + (i % 5),
        score: decimal(10 + i * 3.5),
        notes: "Prepared for future AI moderation integration."
      }
    });
  }

  for (let i = 0; i < 24; i += 1) {
    await prisma.rateLimitEvent.create({
      data: {
        userId: i % 2 === 0 ? pick(users, i).id : null,
        ipAddress: `196.${20 + (i % 20)}.${10 + (i % 80)}.${30 + (i % 60)}`,
        route: pick(["/api/marketplace/search", "/api/listings", "/api/bookings", "/api/reports"], i),
        action: pick(["search", "view", "reserve", "report"], i)
      }
    });
  }

  console.log("Seed complete: 16 users, 25 categories, 20 Egyptian locations, and 55 listings with bookings/trust/fraud showcase data.");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
