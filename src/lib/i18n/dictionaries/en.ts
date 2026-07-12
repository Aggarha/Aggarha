const en = {
  nav: {
    browse: "Browse",
    nearby: "Nearby",
    home: "Home",
    messages: "Messages",
    profile: "Profile",
    featured: "Featured",
    collectibles: "Collectibles",
    playstation: "PlayStation",
    startExploring: "Start Exploring",
    explore: "Explore",
    comingSoon: "Coming soon",
    openMenu: "Open menu",
    closeMenu: "Close menu"
  },
  common: {
    sponsored: "Sponsored",
    verified: "Verified",
    verifiedUser: "Verified User",
    premiumVerifiedUser: "Premium Verified User",
    contactOwner: "Contact owner",
    browseMarketplace: "Browse marketplace",
    backToHome: "Back to Home",
    rent: "Rent",
    swap: "Swap",
    rentSwap: "Rent + Swap"
  },
  home: {
    topRented: "Top Rented",
    topSwapped: "Top Swapped",
    sponsoredListings: "Sponsored Listings",
    popularCategories: "Popular Categories"
  },
  marketplace: {
    searchPlaceholder: "Search listings",
    locationPlaceholder: "Location",
    allCategories: "All categories",
    search: "Search",
    advancedFilters: "Advanced Filters",
    governorate: "Governorate",
    radiusKm: "Radius km",
    anyMode: "Any mode",
    minPrice: "Min price",
    maxPrice: "Max price",
    verifiedOnly: "Verified users only",
    availableOnly: "Available dates only",
    featuredOnly: "Featured/Boosted only",
    sort: {
      newest: "Newest",
      nearest: "Nearest",
      featured: "Featured",
      mostTrusted: "Most Trusted",
      mostViewed: "Most Viewed",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low"
    },
    noResultsTitle: "No matching listings yet",
    noResultsDescription: "Try relaxing filters or changing mode, location, and pricing bounds.",
    clearFilters: "Clear all filters",
    resultsCount: (count: number) => `${count} listings`,
    previousPage: "Previous page",
    nextPage: "Next page"
  },
  listingDetail: {
    overview: "Overview",
    availability: "Availability",
    owner: "Owner",
    reviews: "Reviews",
    relatedListings: "Related Listings",
    noReviews: "No reviews yet.",
    openDates: (count: number) => `${count} open dates`,
    checkCalendar: "Check the calendar for availability",
    level: (level: number) => `Level ${level}`,
    responseRate: "Response Rate",
    avgResponse: "Avg Response",
    completedRentals: "Completed Rentals",
    memberSince: "Member Since",
    overallRating: "Overall Rating",
    reviewsCount: (count: number) => `${count} reviews`,
    noListingsTitle: "No PlayStation listings yet"
  },
  nearby: {
    title: "Near You",
    useMyLocation: "Use my location",
    usingYourLocation: "Using your location",
    locating: "Locating…",
    anywhere: "Anywhere",
    map: "Map",
    list: "List",
    nothingTitle: "Nothing in this radius yet",
    nothingDescription: "Try a wider radius to see more listings."
  },
  playstation: {
    eyebrow: "PlayStation Exchange",
    title: "Gamers Zone",
    titleLine2: "Rent games, swap your shelf",
    browseListings: "Browse PlayStation Listings",
    listToSwap: "List a Game to Swap",
    live: "live",
    trendingGames: "Trending Games",
    bundles: "Bundles",
    accessories: "Accessories",
    featuredOffers: "Featured Offers",
    noListingsTitle: "No PlayStation listings yet",
    noListingsDescription: "Check back soon as more trusted traders list titles and bundles."
  },
  collectibles: {
    title: "Collectors’ Rare Finds",
    spotlight: "Spotlight",
    awaitingFirstPiece: "Awaiting first piece",
    rareFindsAppear: "Rare finds will appear here.",
    noFindsTitle: "No rare finds yet",
    noFindsDescription: "Check back soon as more collector-grade inventory is listed.",
    moreToExplore: "More to explore",
    rarity: {
      veryRare: "Very Rare",
      rare: "Rare",
      collectorGrade: "Collector Grade",
      common: "Common"
    }
  },
  featured: {
    title: "Featured Drops",
    browseAll: "Browse all",
    noFeaturedTitle: "No featured listings yet",
    noFeaturedDescription: "Check back soon as owners promote inventory."
  },
  error: {
    badge: "Something broke",
    title: "This part of Aggarha hit a snag.",
    message: "Try again, or head back while we sort it out.",
    tryAgain: "Try Again"
  },
  notFound: {
    badge: "404",
    title: "This page wandered off the marketplace.",
    message: "That listing or page may have been removed or never existed."
  },
  offline: {
    badge: "No Connection",
    title: "You’re offline right now.",
    message: "Reconnect to keep browsing — we’ll pick up right where you left off."
  },
  footer: {
    rights: (year: number) => `© ${year} Aggarha`
  },
  language: {
    label: "Language",
    english: "English",
    arabic: "العربية"
  }
};

export default en;
