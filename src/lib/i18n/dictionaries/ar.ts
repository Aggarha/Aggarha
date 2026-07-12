import type { Dictionary } from "@/lib/i18n/dictionary-type";

const ar: Dictionary = {
  nav: {
    browse: "تصفح",
    nearby: "بالقرب مني",
    home: "الرئيسية",
    messages: "الرسائل",
    profile: "الملف الشخصي",
    featured: "مميز",
    collectibles: "نادرة",
    playstation: "بلايستيشن",
    startExploring: "ابدأ الاستكشاف",
    explore: "استكشف",
    comingSoon: "قريبًا",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة"
  },
  common: {
    sponsored: "إعلان ممول",
    verified: "موثق",
    verifiedUser: "مستخدم موثق",
    premiumVerifiedUser: "مستخدم موثق مميز",
    contactOwner: "تواصل مع المالك",
    browseMarketplace: "تصفح السوق",
    backToHome: "العودة للرئيسية",
    rent: "إيجار",
    swap: "تبديل",
    rentSwap: "إيجار + تبديل"
  },
  home: {
    topRented: "الأكثر إيجارًا",
    topSwapped: "الأكثر تبديلًا",
    sponsoredListings: "إعلانات موثقة",
    popularCategories: "تصفح حسب الفئة"
  },
  marketplace: {
    searchPlaceholder: "ابحث في الإعلانات",
    locationPlaceholder: "الموقع",
    allCategories: "كل الفئات",
    search: "بحث",
    advancedFilters: "فلاتر متقدمة",
    governorate: "المحافظة",
    radiusKm: "النطاق بالكيلومتر",
    anyMode: "أي وضع",
    minPrice: "أقل سعر",
    maxPrice: "أعلى سعر",
    verifiedOnly: "الحسابات الموثقة فقط",
    availableOnly: "المتاح فقط",
    featuredOnly: "المميز فقط",
    sort: {
      newest: "الأحدث",
      nearest: "الأقرب",
      featured: "المميز",
      mostTrusted: "الأكثر ثقة",
      mostViewed: "الأكثر مشاهدة",
      priceLow: "السعر: من الأقل للأعلى",
      priceHigh: "السعر: من الأعلى للأقل"
    },
    noResultsTitle: "لا توجد إعلانات مطابقة بعد",
    noResultsDescription: "جرّب تخفيف الفلاتر أو تغيير الوضع أو الموقع أو نطاق السعر.",
    clearFilters: "مسح كل الفلاتر"
  },
  listingDetail: {
    overview: "نظرة عامة",
    availability: "التوفر",
    owner: "المالك",
    reviews: "التقييمات",
    relatedListings: "إعلانات ذات صلة",
    noReviews: "لا توجد تقييمات بعد.",
    openDates: (count) => `${count} تاريخ متاح`,
    checkCalendar: "راجع التقويم لمعرفة التوفر",
    level: (level) => `المستوى ${level}`,
    responseRate: "معدل الاستجابة",
    avgResponse: "متوسط الرد",
    completedRentals: "عمليات إيجار مكتملة",
    memberSince: "عضو منذ",
    overallRating: "التقييم العام",
    reviewsCount: (count) => `${count} تقييم`,
    noListingsTitle: "لا توجد إعلانات بلايستيشن بعد"
  },
  nearby: {
    title: "بالقرب منك",
    useMyLocation: "استخدم موقعي",
    usingYourLocation: "يتم استخدام موقعك",
    locating: "جارٍ التحديد…",
    anywhere: "أي مكان",
    map: "الخريطة",
    list: "القائمة",
    nothingTitle: "لا يوجد شيء في هذا النطاق بعد",
    nothingDescription: "جرّب نطاقًا أوسع لرؤية المزيد من الإعلانات."
  },
  playstation: {
    eyebrow: "بلايستيشن",
    title: "عالم اللاعبين",
    browseListings: "تصفح إعلانات بلايستيشن",
    live: "متاح",
    trendingGames: "ألعاب رائجة",
    bundles: "باقات",
    accessories: "إكسسوارات",
    featuredOffers: "عروض مميزة",
    noListingsTitle: "لا توجد إعلانات بلايستيشن بعد",
    noListingsDescription: "تحقق لاحقًا مع إضافة المزيد من العروض من التجار الموثوقين."
  },
  collectibles: {
    title: "كنوز نادرة للهواة",
    spotlight: "قطعة مميزة",
    awaitingFirstPiece: "في انتظار أول قطعة",
    rareFindsAppear: "ستظهر القطع النادرة هنا.",
    noFindsTitle: "لا توجد قطع نادرة بعد",
    noFindsDescription: "تحقق لاحقًا مع إضافة المزيد من المقتنيات النادرة.",
    moreToExplore: "المزيد لاستكشافه",
    rarity: {
      veryRare: "نادرة جدًا",
      rare: "نادرة",
      collectorGrade: "درجة الهواة",
      common: "شائعة"
    }
  },
  featured: {
    title: "أبرز العروض",
    browseAll: "عرض الكل",
    noFeaturedTitle: "لا توجد إعلانات مميزة بعد",
    noFeaturedDescription: "تحقق لاحقًا مع ترويج الملاك لإعلاناتهم."
  },
  error: {
    badge: "حدث خطأ ما",
    title: "واجه هذا الجزء من أجرها مشكلة.",
    message: "حاول مرة أخرى أو عد للرئيسية بينما نصلح الأمر.",
    tryAgain: "حاول مرة أخرى"
  },
  notFound: {
    badge: "٤٠٤",
    title: "هذه الصفحة ضلّت طريقها في السوق.",
    message: "قد يكون هذا الإعلان أو الصفحة قد أُزيل أو لم يكن موجودًا من الأساس."
  },
  offline: {
    badge: "لا يوجد اتصال",
    title: "أنت غير متصل بالإنترنت الآن.",
    message: "أعد الاتصال لمتابعة التصفح — سنكمل من حيث توقفت."
  },
  footer: {
    rights: (year) => `© ${year} أجرها`
  },
  language: {
    label: "اللغة",
    english: "English",
    arabic: "العربية"
  }
};

export default ar;
