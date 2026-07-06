import { PrismaClient, DealStatus, ListingMode, ListingStatus, UserRole, VerificationLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { slug: "gaming-consoles", name: "Gaming Consoles", description: "Consoles and accessories" },
    { slug: "camera-gear", name: "Camera Gear", description: "Cameras, lenses, and rigs" },
    { slug: "audio-equipment", name: "Audio Equipment", description: "Mics, mixers, and speakers" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const doha = await prisma.location.upsert({
    where: { id: "seed-doha-location" },
    update: {
      city: "Doha",
      state: "Doha",
      country: "Qatar",
      latitude: 25.285447,
      longitude: 51.53104,
      formattedAddress: "Doha, Qatar"
    },
    create: {
      id: "seed-doha-location",
      city: "Doha",
      state: "Doha",
      country: "Qatar",
      latitude: 25.285447,
      longitude: 51.53104,
      formattedAddress: "Doha, Qatar"
    }
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller.demo@aggarha.local" },
    update: {
      role: UserRole.RESELLER,
      verificationLevel: VerificationLevel.EMAIL_VERIFIED,
      trustScore: 82.5,
      trustTier: 3,
      xp: 1420,
      level: 9,
      emailVerifiedAt: new Date()
    },
    create: {
      email: "seller.demo@aggarha.local",
      phone: "+10000000001",
      role: UserRole.RESELLER,
      verificationLevel: VerificationLevel.EMAIL_VERIFIED,
      trustScore: 82.5,
      trustTier: 3,
      xp: 1420,
      level: 9,
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          handle: "seller-demo",
          displayName: "Seller Demo",
          bio: "Trusted demo seller account.",
          city: "Doha",
          country: "Qatar",
          responseRate: 97.5,
          completionRate: 94.5,
          successfulDeals: 23,
          failedDeals: 1,
          reviewCount: 18,
          averageRating: 4.72
        }
      }
    }
  });

  const buyer = await prisma.user.upsert({
    where: { email: "buyer.demo@aggarha.local" },
    update: {
      role: UserRole.USER,
      verificationLevel: VerificationLevel.PHONE_VERIFIED,
      trustScore: 68.2,
      trustTier: 2,
      xp: 560,
      level: 5,
      phoneVerifiedAt: new Date()
    },
    create: {
      email: "buyer.demo@aggarha.local",
      phone: "+10000000002",
      role: UserRole.USER,
      verificationLevel: VerificationLevel.PHONE_VERIFIED,
      trustScore: 68.2,
      trustTier: 2,
      xp: 560,
      level: 5,
      phoneVerifiedAt: new Date(),
      profile: {
        create: {
          handle: "buyer-demo",
          displayName: "Buyer Demo",
          bio: "Demo renter profile.",
          city: "Doha",
          country: "Qatar",
          responseRate: 88.0,
          completionRate: 90.0,
          successfulDeals: 9,
          failedDeals: 1,
          reviewCount: 7,
          averageRating: 4.4
        }
      }
    }
  });

  const consoles = await prisma.category.findUniqueOrThrow({ where: { slug: "gaming-consoles" } });

  const listing = await prisma.listing.upsert({
    where: { id: "seed-listing-ps5" },
    update: {
      ownerId: seller.id,
      categoryId: consoles.id,
      locationId: doha.id,
      title: "PlayStation 5 + 2 Controllers",
      description: "Safe demo listing for migration and seed validation.",
      mode: ListingMode.RENT,
      status: ListingStatus.ACTIVE,
      quantity: 1,
      priceAmount: 120,
      currencyCode: "QAR",
      trustScoreSnapshot: 82.5,
      ownerLevelSnapshot: 9
    },
    create: {
      id: "seed-listing-ps5",
      ownerId: seller.id,
      categoryId: consoles.id,
      locationId: doha.id,
      title: "PlayStation 5 + 2 Controllers",
      description: "Safe demo listing for migration and seed validation.",
      mode: ListingMode.RENT,
      status: ListingStatus.ACTIVE,
      quantity: 1,
      priceAmount: 120,
      currencyCode: "QAR",
      trustScoreSnapshot: 82.5,
      ownerLevelSnapshot: 9
    }
  });

  const deal = await prisma.deal.upsert({
    where: { id: "seed-deal-1" },
    update: {
      listingId: listing.id,
      initiatorId: buyer.id,
      ownerId: seller.id,
      renterId: buyer.id,
      status: DealStatus.COMPLETED,
      ownerConfirmedAt: new Date(),
      renterConfirmedAt: new Date(),
      completedAt: new Date(),
      xpReleased: true
    },
    create: {
      id: "seed-deal-1",
      listingId: listing.id,
      initiatorId: buyer.id,
      ownerId: seller.id,
      renterId: buyer.id,
      status: DealStatus.COMPLETED,
      ownerConfirmedAt: new Date(),
      renterConfirmedAt: new Date(),
      completedAt: new Date(),
      xpReleased: true
    }
  });

  await prisma.review.upsert({
    where: { dealId_reviewerId: { dealId: deal.id, reviewerId: buyer.id } },
    update: {
      revieweeId: seller.id,
      rating: 5,
      comment: "Great communication and on-time handoff.",
      trustImpact: 2.1,
      xpImpact: 40
    },
    create: {
      dealId: deal.id,
      reviewerId: buyer.id,
      revieweeId: seller.id,
      rating: 5,
      comment: "Great communication and on-time handoff.",
      trustImpact: 2.1,
      xpImpact: 40
    }
  });

  console.log("Seed complete: demo users, categories, listing, deal, and review created.");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
