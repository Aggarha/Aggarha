import {
  AvailabilityDateStatus,
  ListingMode,
  ListingStatus,
  ListingVisibility,
  Prisma,
  VerificationLevel
} from "@prisma/client";
import { prisma } from "@/lib/db";

export type ListingSort = "newest" | "nearest" | "featured" | "most_trusted" | "most_viewed" | "price_low" | "price_high";

export type SearchFilters = {
  keyword?: string;
  category?: string;
  governorate?: string;
  city?: string;
  district?: string;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  mode?: ListingMode;
  availability?: "available" | "any";
  verifiedOnly?: boolean;
  minTrustScore?: number;
  minLevel?: number;
  sort?: ListingSort;
  featuredOnly?: boolean;
  page?: number;
  pageSize?: number;
};

const marketplaceStatuses: ListingStatus[] = [
  ListingStatus.PUBLISHED,
  ListingStatus.RESERVED,
  ListingStatus.RENTED,
  ListingStatus.SWAPPED,
  ListingStatus.COMPLETED
];

function decimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

export function parseSearchFilters(input: Record<string, string | string[] | undefined>): SearchFilters {
  const asValue = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

  const toNumber = (value: string | undefined): number | undefined => {
    if (!value) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const mode = asValue(input.mode);
  const sort = asValue(input.sort);

  return {
    keyword: asValue(input.keyword),
    category: asValue(input.category),
    governorate: asValue(input.governorate),
    city: asValue(input.city),
    district: asValue(input.district),
    radius: toNumber(asValue(input.radius)),
    minPrice: toNumber(asValue(input.minPrice)),
    maxPrice: toNumber(asValue(input.maxPrice)),
    mode: mode === "RENT" || mode === "SWAP" || mode === "BOTH" ? mode : undefined,
    availability: asValue(input.availability) === "available" ? "available" : "any",
    verifiedOnly: asValue(input.verifiedOnly) === "true",
    minTrustScore: toNumber(asValue(input.minTrustScore)),
    minLevel: toNumber(asValue(input.minLevel)),
    sort:
      sort === "newest" ||
      sort === "nearest" ||
      sort === "featured" ||
      sort === "most_trusted" ||
      sort === "most_viewed" ||
      sort === "price_low" ||
      sort === "price_high"
        ? sort
        : "newest",
    featuredOnly: asValue(input.featuredOnly) === "true",
    page: Math.max(1, toNumber(asValue(input.page)) ?? 1),
    pageSize: Math.min(60, Math.max(6, toNumber(asValue(input.pageSize)) ?? 24))
  };
}

function mapSort(sort: ListingSort | undefined): Prisma.ListingOrderByWithRelationInput[] {
  switch (sort) {
    case "most_trusted":
      return [{ owner: { trustScore: "desc" } }, { createdAt: "desc" }];
    case "most_viewed":
      return [{ viewCount: "desc" }, { createdAt: "desc" }];
    case "price_low":
      return [{ priceAmount: "asc" }, { createdAt: "desc" }];
    case "price_high":
      return [{ priceAmount: "desc" }, { createdAt: "desc" }];
    case "nearest":
      return [{ location: { governorate: "asc" } }, { location: { city: "asc" } }, { createdAt: "desc" }];
    case "featured":
      return [{ featuredUntil: "desc" }, { boostedUntil: "desc" }, { createdAt: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }];
  }
}

function visibilityForFeaturedOnly(featuredOnly: boolean | undefined): ListingVisibility[] | undefined {
  if (!featuredOnly) {
    return undefined;
  }
  return [ListingVisibility.FEATURED, ListingVisibility.BOOSTED];
}

export async function searchListings(filters: SearchFilters) {
  const where: Prisma.ListingWhereInput = {
    status: {
      in: marketplaceStatuses
    },
    visibility: visibilityForFeaturedOnly(filters.featuredOnly)
      ? { in: visibilityForFeaturedOnly(filters.featuredOnly) }
      : { not: ListingVisibility.HIDDEN }
  };

  if (filters.keyword) {
    where.OR = [
      { title: { contains: filters.keyword, mode: "insensitive" } },
      { description: { contains: filters.keyword, mode: "insensitive" } },
      { category: { name: { contains: filters.keyword, mode: "insensitive" } } }
    ];
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.mode) {
    where.mode = filters.mode;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.priceAmount = {
      gte: filters.minPrice !== undefined ? decimal(filters.minPrice) : undefined,
      lte: filters.maxPrice !== undefined ? decimal(filters.maxPrice) : undefined
    };
  }

  if (filters.governorate || filters.city || filters.district || filters.radius) {
    where.location = {
      is: {
        governorate: filters.governorate,
        city: filters.city,
        district: filters.district,
        searchRadiusKm: filters.radius ? { gte: filters.radius } : undefined
      }
    };
  }

  if (filters.verifiedOnly || filters.minTrustScore !== undefined || filters.minLevel !== undefined) {
    where.owner = {
      is: {
        verificationLevel: filters.verifiedOnly ? { not: VerificationLevel.UNVERIFIED } : undefined,
        trustScore: filters.minTrustScore !== undefined ? { gte: decimal(filters.minTrustScore) } : undefined,
        level: filters.minLevel !== undefined ? { gte: filters.minLevel } : undefined
      }
    };
  }

  if (filters.availability === "available") {
    where.availabilityDates = {
      some: {
        status: AvailabilityDateStatus.AVAILABLE,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    };
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: mapSort(filters.sort),
      skip,
      take: pageSize,
      include: {
        category: true,
        location: true,
        owner: {
          select: {
            id: true,
            verificationLevel: true,
            trustScore: true,
            level: true,
            profile: {
              select: {
                displayName: true,
                averageRating: true,
                reviewCount: true
              }
            }
          }
        },
        availabilityDates: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          },
          orderBy: {
            date: "asc"
          },
          take: 10
        }
      }
    }),
    prisma.listing.count({ where })
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize)
  };
}

export async function getCategoryTree() {
  const all = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const byParent = new Map<string | null, typeof all>();

  for (const category of all) {
    const key = category.parentId ?? null;
    const bucket = byParent.get(key) ?? [];
    bucket.push(category);
    byParent.set(key, bucket);
  }

  type CategoryTreeNode = (typeof all)[number] & { children: CategoryTreeNode[] };

  const build = (parentId: string | null): CategoryTreeNode[] =>
    (byParent.get(parentId) ?? []).map((category) => ({
      ...category,
      children: build(category.id)
    }));

  return build(null);
}

export async function getHomepageShowcase() {
  const [featured, newest, topCategories, topLocations] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: { in: marketplaceStatuses },
        visibility: { in: [ListingVisibility.FEATURED, ListingVisibility.BOOSTED, ListingVisibility.PUBLIC] }
      },
      orderBy: [{ featuredUntil: "desc" }, { boostedUntil: "desc" }, { viewCount: "desc" }],
      take: 8,
      include: {
        category: true,
        location: true,
        owner: { include: { profile: true } }
      }
    }),
    prisma.listing.findMany({
      where: { status: { in: marketplaceStatuses }, visibility: { not: ListingVisibility.HIDDEN } },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { category: true, location: true, owner: { include: { profile: true } } }
    }),
    prisma.category.findMany({
      orderBy: { listings: { _count: "desc" } },
      take: 8,
      include: { _count: { select: { listings: true } } }
    }),
    prisma.location.findMany({
      orderBy: { listings: { _count: "desc" } },
      take: 8,
      include: { _count: { select: { listings: true } } }
    })
  ]);

  return {
    featured,
    newest,
    topCategories,
    topLocations
  };
}

export async function getListingDetails(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      category: true,
      location: true,
      owner: {
        include: {
          profile: true
        }
      },
      availabilityRules: {
        orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }]
      },
      availabilityDates: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        orderBy: { date: "asc" },
        take: 30
      },
      bookings: {
        orderBy: { startDate: "asc" },
        take: 10,
        include: {
          requester: {
            include: {
              profile: true
            }
          }
        }
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          reviewer: {
            include: { profile: true }
          }
        }
      }
    }
  });

  if (!listing) {
    return null;
  }

  await prisma.listing.update({
    where: { id: listing.id },
    data: { viewCount: { increment: 1 } }
  });

  return listing;
}
