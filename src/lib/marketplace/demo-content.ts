/**
 * Frontend-only demo catalog dressing and category-matched product photography.
 *
 * The seeded database (prisma/seed.ts) has real (if repetitive) English
 * titles, one boilerplate description reused across every listing, and
 * generic seller display names ("Aggarha Seller 4"). Nothing here writes to
 * the database — this module exists purely to make the demo catalog read
 * like a real, lived-in Egyptian marketplace on the display layer, without
 * touching a single row.
 *
 * Every value is deterministically derived from the listing's real `id` (or
 * the owner's real `id` for seller names), so the same listing always shows
 * the same title, description, seller, and photo across renders and pages —
 * and, critically, a listing's assigned CONTENT LANGUAGE never changes when
 * a viewer switches the interface language. Content language and interface
 * language are two independent axes: a listing written in Arabic stays
 * Arabic in an English-locale UI, and vice versa, exactly like a real
 * marketplace where sellers post in whatever language they wrote in.
 */

import type { Locale } from "@/lib/i18n/types";

/** Stable, non-cryptographic string hash — same approach as condition-evidence.ts. */
function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(hash, 31) + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * A listing's own content language — a property of the listing, not of
 * whoever is currently viewing it. Skewed toward Arabic (60/40) to feel like
 * a real Cairo/Alexandria marketplace where most — not all — posts are
 * written in Arabic.
 */
export function getListingLanguage(listingId: string): Locale {
  return hashSeed(`${listingId}-content-lang`) % 5 < 3 ? "ar" : "en";
}

const ARABIC_SCRIPT_RANGE = /[؀-ۿݐ-ݿ]/;

/** Detects a real listing's content language from its actual text, not a per-id hash. */
export function isArabicText(text: string): boolean {
  return ARABIC_SCRIPT_RANGE.test(text);
}

type CategoryContent = {
  titles: { en: [string, string, string]; ar: [string, string, string] };
  description: { en: string; ar: string };
};

const CATALOG: Record<string, CategoryContent> = {
  electronics: {
    titles: {
      en: ["JBL Charge 5 Bluetooth Speaker", "Samsung 55\" 4K Smart TV", "iPad 9th Gen 64GB, Wi-Fi"],
      ar: ["سماعة JBL Charge 5 بلوتوث", "شاشة سامسونج ٥٥ بوصة سمارت", "آيباد جيل تاسع ٦٤ جيجا واي فاي"]
    },
    description: {
      en: "Barely used, comes with original charger and box. Great for a short trip or a weekend project.",
      ar: "استخدام خفيف جدًا، وموجود معاه الشاحن والكرتونة الأصلية. مناسب لرحلة قصيرة أو مشروع نهاية الأسبوع."
    }
  },
  gaming: {
    titles: {
      en: ["PlayStation 5 Slim + 2 Controllers", "Xbox Series S 512GB White", "Nintendo Switch OLED + 3 Games"],
      ar: ["بلايستيشن 5 سليم + دراعين", "إكس بوكس سيريس إس ٥١٢ جيجا أبيض", "نينتندو سويتش أوليد + ٣ ألعاب"]
    },
    description: {
      en: "Everything works perfectly, no disc errors. Ideal for a weekend or a longer swap with another console.",
      ar: "شغالة تمام من غير أي مشاكل. مناسبة للإيجار في الويك اند أو للبدل بجهاز تاني."
    }
  },
  "gaming-consoles": {
    titles: {
      en: ["PlayStation 5 Digital Edition", "Xbox Series X 1TB Bundle", "Steam Deck OLED 512GB"],
      ar: ["بلايستيشن 5 ديجيتال إديشن", "إكس بوكس سيريس إكس ١ تيرا", "ستيم ديك أوليد ٥١٢ جيجا"]
    },
    description: {
      en: "Owned since launch, always kept in a well-ventilated spot. Original box and cables included.",
      ar: "عندي من وقت الإطلاق ومحافظ عليها كويس. الكرتونة والأسلاك الأصلية موجودة."
    }
  },
  photography: {
    titles: {
      en: ["Sony A7 III Body Only", "Canon R6 + 24-105mm Kit", "DJI Ronin-SC Gimbal, Barely Used"],
      ar: ["كاميرا Sony A7 III بودي فقط", "كانون R6 مع عدسة ٢٤-١٠٥", "جيمبال DJI Ronin-SC استخدام بسيط"]
    },
    description: {
      en: "Shutter count under 8,000. Perfect for a wedding shoot or a weekend content project.",
      ar: "عدد اللقطات أقل من ٨٠٠٠. ممتازة لتصوير فرح أو مشروع تصوير في الويك اند."
    }
  },
  "camera-lenses": {
    titles: {
      en: ["Canon 50mm f/1.8 STM", "Sony 24-70mm f/2.8 GM", "Sigma 35mm f/1.4 Art for Nikon"],
      ar: ["عدسة كانون ٥٠ مم", "عدسة سوني ٢٤-٧٠ f/2.8", "عدسة سيجما ٣٥ مم لنيكون"]
    },
    description: {
      en: "No fungus, no scratches on the glass. Comes with front and rear caps.",
      ar: "من غير أي خدوش أو مشاكل في الزجاج. معاها الغطاء الأمامي والخلفي."
    }
  },
  furniture: {
    titles: {
      en: ["IKEA KIVIK 3-Seat Sofa, Grey", "Solid Wood Dining Table, 6 Seats", "Office Desk + Ergonomic Chair"],
      ar: ["كنبة ايكيا KIVIK ٣ مقاعد رمادي", "طاولة سفرة خشب طبيعي ٦ كراسي", "مكتب مع كرسي مكتب مريح"]
    },
    description: {
      en: "Moving out soon, in great condition, no stains or tears. Pickup from the listed area preferred.",
      ar: "هنقل قريب، الحالة ممتازة من غير أي بقع. يفضل الاستلام من المنطقة المذكورة."
    }
  },
  cars: {
    titles: {
      en: ["Hyundai Elantra 2022, Automatic", "Fiat 500 2021, Low Mileage", "Kia Sportage 2023, Full Option"],
      ar: ["هيونداي النترا ٢٠٢٢ أوتوماتيك", "فيات ٥٠٠ ٢٠٢١ عداد قليل", "كيا سبورتاج ٢٠٢٣ فل أوبشن"]
    },
    description: {
      en: "Regularly serviced, insurance included for the rental period. Airport pickup can be arranged.",
      ar: "صيانة دورية، والتأمين متضمن في فترة الإيجار. ممكن نظام استلام من المطار."
    }
  },
  motorcycles: {
    titles: {
      en: ["Honda CBR 250R, 2021", "Yamaha XSR 155, Low KM", "Electric Scooter, 60km Range"],
      ar: ["هوندا CBR 250R موديل ٢٠٢١", "ياماها XSR 155 عداد قليل", "سكوتر كهربائي مدى ٦٠ كم"]
    },
    description: {
      en: "Helmet included with the rental. Great condition, ready to ride today.",
      ar: "الخوذة متضمنة مع الإيجار. الحالة ممتازة وجاهزة للاستخدام النهاردة."
    }
  },
  fashion: {
    titles: {
      en: ["Designer Evening Gown, Size M", "Men's Tailored Suit, Navy", "Occasion Abaya, Hand-Embroidered"],
      ar: ["فستان سهرة ماركة مقاس M", "بدلة رجالي كحلي مفصّلة", "عباية مناسبات مطرزة يدوي"]
    },
    description: {
      en: "Dry-cleaned after every use. Worn twice, kept in a garment bag.",
      ar: "بتتنضف تنظيف جاف بعد كل استخدام. اتلبست مرتين بس ومحفوظة في شنطة قماش."
    }
  },
  wedding: {
    titles: {
      en: ["Full Wedding Decor Package", "Gold Chiavari Chairs x50", "Wedding Backdrop + Uplighting Set"],
      ar: ["باقة ديكور فرح كاملة", "كراسي شيافاري ذهبي ٥٠ كرسي", "خلفية فرح مع إضاءة"]
    },
    description: {
      en: "Setup and pickup can be coordinated with the venue. Photos on request from recent events.",
      ar: "ممكن ننسق التركيب والاستلام مع صالة المناسبة. متاح صور من مناسبات سابقة لو حابب تشوف."
    }
  },
  "wedding-dresses": {
    titles: {
      en: ["Ball Gown Wedding Dress, Size S", "Mermaid-Cut Bridal Gown, Ivory", "Engagement Dress, Blush Pink"],
      ar: ["فستان زفاف بشكل الأميرات مقاس S", "فستان عروس قصة الحورية عاجي", "فستان خطوبة روز فاتح"]
    },
    description: {
      en: "Professionally cleaned after each rental. Alterations for a perfect fit can be discussed.",
      ar: "بيتنضف باحترافية بعد كل إيجار. ممكن نتكلم على تعديلات بسيطة عشان يظبط عليكِ."
    }
  },
  kids: {
    titles: {
      en: ["Baby Stroller, 3-in-1", "Wooden Building Blocks Set", "Convertible Car Seat, 0-4 Years"],
      ar: ["عربة أطفال ٣ في ١", "مكعبات بناء خشبية", "كرسي أطفال للسيارة من ٠ ل٤ سنين"]
    },
    description: {
      en: "Cleaned and sanitized before every handover. Great for visiting family or a short trip.",
      ar: "بتتنضف وتتعقم قبل كل تسليم. مناسبة لزيارة أهل أو رحلة قصيرة."
    }
  },
  camping: {
    titles: {
      en: ["6-Person Camping Tent", "Camping Gear Bundle: Tent + Stove", "4-Season Sleeping Bags x2"],
      ar: ["خيمة تخييم ٦ أشخاص", "طقم تخييم: خيمة وبوتاجاز", "أكياس نوم لكل الفصول عدد ٢"]
    },
    description: {
      en: "Used on three trips, no tears or mold. Comes packed in its original carry bag.",
      ar: "اتستخدمت في ٣ رحلات بس من غير أي قطع أو عفن. متعبية في الشنطة الأصلية بتاعتها."
    }
  },
  sports: {
    titles: {
      en: ["Trek Mountain Bike, Size L", "Treadmill, Foldable, Home Use", "Full Boxing Bag + Gloves Set"],
      ar: ["دراجة تريك جبلية مقاس L", "جهاز مشي قابل للطي للمنزل", "كيس ملاكمة كامل مع القفازات"]
    },
    description: {
      en: "Tuned up recently, brakes and gears working smoothly. Great for a weekend or longer.",
      ar: "اتظبطت مؤخرًا، الفرامل والتروس شغالة تمام. مناسبة للويك اند أو لمدة أطول."
    }
  },
  construction: {
    titles: {
      en: ["Complete Hand Tool Set, 120pc", "Aluminum Scaffolding, 3m", "Concrete Mixer, Portable"],
      ar: ["طقم عدة يدوي كامل ١٢٠ قطعة", "سقالة ألومنيوم ٣ متر", "خلاطة أسمنت متنقلة"]
    },
    description: {
      en: "Used on residential projects only, well maintained. Delivery within the city can be arranged.",
      ar: "اتستخدمت في مشاريع سكنية بس ومحافظ عليها. ممكن ترتيب توصيل جوه المدينة."
    }
  },
  "power-tools": {
    titles: {
      en: ["Bosch Cordless Drill Set", "DeWalt Circular Saw", "Makita Angle Grinder + Blades"],
      ar: ["طقم مثقاب بوش لاسلكي", "منشار ديوالت الدائري", "زاوية ماكيتا مع شفرات إضافية"]
    },
    description: {
      en: "Battery holds charge well, comes with the original case. Light residential use only.",
      ar: "البطارية بتحتفظ بالشحن كويس، ومعاها الشنطة الأصلية. استخدام منزلي خفيف بس."
    }
  },
  "professional-equipment": {
    titles: {
      en: ["Audio Interface + Studio Monitors", "Portable Generator, 3000W", "Industrial Sewing Machine"],
      ar: ["إنترفيس صوت مع سماعات استوديو", "مولد كهرباء متنقل ٣٠٠٠ واط", "ماكينة خياطة صناعية"]
    },
    description: {
      en: "Maintained on a regular schedule, ready for professional use from day one.",
      ar: "بتتصان بشكل دوري وجاهزة للاستخدام الاحترافي من أول يوم."
    }
  },
  "event-equipment": {
    titles: {
      en: ["Full PA Sound System, 2000W", "LED Stage Lighting Kit", "4K Projector + Screen"],
      ar: ["نظام صوت كامل ٢٠٠٠ واط", "طقم إضاءة مسرح LED", "بروجيكتور 4K مع شاشة"]
    },
    description: {
      en: "Tested before every rental, cables and mounts included. Setup guidance provided.",
      ar: "بتتجرب قبل كل إيجار، والأسلاك والحوامل متضمنة. متاح شرح للتركيب."
    }
  },
  "musical-instruments": {
    titles: {
      en: ["Fender Stratocaster Electric Guitar", "Yamaha Digital Piano, 88 Keys", "Roland Electronic Drum Kit"],
      ar: ["جيتار كهربائي فندر ستراتوكاستر", "بيانو ياماها ديجيتال ٨٨ مفتاح", "طبلة رولاند إلكترونية"]
    },
    description: {
      en: "Recently restrung and tuned, no buzzing or dead frets. Comes with a soft case.",
      ar: "اتركبله أوتار جديدة واتظبط مؤخرًا، من غير أي مشاكل. معاه شنطة حماية."
    }
  },
  "dj-systems": {
    titles: {
      en: ["Pioneer DDJ-FLX6 Controller", "DJ Booth Setup: Mixer + Speakers", "Traktor Kontrol S4 MK3"],
      ar: ["كنترولر باينير DDJ-FLX6", "طقم دي جي: ميكسر وسماعات", "تراكتور كنترول S4 MK3"]
    },
    description: {
      en: "Used for private events only, all pads and jogs responsive. Original box included.",
      ar: "اتستخدم في مناسبات خاصة بس وكل الأزرار شغالة تمام. الكرتونة الأصلية موجودة."
    }
  },
  books: {
    titles: {
      en: ["Engineering Textbook Bundle, 1st Year", "First Edition Novel Collection", "IELTS Prep Book Set + Audio"],
      ar: ["مجموعة كتب هندسة السنة الأولى", "مجموعة روايات طبعة أولى", "كتب تحضير IELTS مع الصوتيات"]
    },
    description: {
      en: "Minimal highlighting, all pages intact. Great for a semester or a quick read.",
      ar: "تحته خط في أماكن بسيطة بس، وكل الصفحات موجودة. مناسبة لترم دراسي أو قراءة سريعة."
    }
  },
  pets: {
    titles: {
      en: ["Large Dog Travel Crate", "Cat Tree Tower, 1.5m", "Pet Stroller for Small Dogs"],
      ar: ["قفص سفر كبير للكلاب", "برج قطط ١.٥ متر", "عربة نزهة للكلاب الصغيرة"]
    },
    description: {
      en: "Cleaned and odor-free, used with a healthy, vaccinated pet only.",
      ar: "متنضفة ومفيش أي ريحة، اتستخدمت مع حيوان أليف سليم وماخد تطعيماته بس."
    }
  },
  "real-estate": {
    titles: {
      en: ["Furnished Studio, New Cairo", "2-Bedroom Apartment, Maadi", "Chalet for Weekend Rental, North Coast"],
      ar: ["استوديو مفروش في القاهرة الجديدة", "شقة غرفتين في المعادي", "شاليه للإيجار الويك اند بالساحل"]
    },
    description: {
      en: "Fully furnished and utilities-ready. Flexible check-in, photos available on request.",
      ar: "مفروشة بالكامل وجاهزة للسكن. تسكين مرن، ومتاح صور لو حابب تشوف."
    }
  },
  services: {
    titles: {
      en: ["Wedding Photography Package", "Event Planning & Coordination", "Professional Videography Day Rate"],
      ar: ["باقة تصوير أفراح", "تنظيم وتنسيق مناسبات", "تصوير فيديو احترافي باليوم"]
    },
    description: {
      en: "Portfolio available on request, flexible scheduling around your event date.",
      ar: "متاح بورتفوليو لو حابب تشوف، والمواعيد مرنة حسب تاريخ مناسبتك."
    }
  },
  experiences: {
    titles: {
      en: ["Private Photography Session, 2hrs", "Full Birthday Party Package", "Nile Dinner Cruise for Two"],
      ar: ["جلسة تصوير خاصة ساعتين", "باقة عيد ميلاد كاملة", "رحلة عشاء في النيل لشخصين"]
    },
    description: {
      en: "Booked in advance, customizable based on group size and location.",
      ar: "بيتحجز مقدمًا، وممكن نظبطه حسب عدد الأشخاص والمكان."
    }
  }
};

const GENERIC_TITLES = {
  en: ["Quality Item for Rent or Swap", "Well-Maintained, Ready to Go", "Available Now, Flexible Terms"] as [
    string,
    string,
    string
  ],
  ar: ["قطعة بحالة ممتازة للإيجار أو البدل", "محافظ عليها وجاهزة للاستخدام", "متاحة الآن بشروط مرنة"] as [
    string,
    string,
    string
  ]
};

const GENERIC_DESCRIPTION = {
  en: "Well cared for and ready to hand over. Message the owner for more details or to arrange pickup.",
  ar: "محافظ عليها وجاهزة للتسليم. تواصل مع المالك لمزيد من التفاصيل أو لترتيب الاستلام."
};

/** A demo listing's title, in its own (locale-independent) content language. */
export function buildDemoTitle(listingId: string, categorySlug: string): string {
  const lang = getListingLanguage(listingId);
  const pool = CATALOG[categorySlug]?.titles[lang] ?? GENERIC_TITLES[lang];
  const index = hashSeed(listingId) % pool.length;
  return pool[index];
}

/** A demo listing's description, in its own (locale-independent) content language. */
export function buildDemoDescription(listingId: string, categorySlug: string): string {
  const lang = getListingLanguage(listingId);
  return CATALOG[categorySlug]?.description[lang] ?? GENERIC_DESCRIPTION[lang];
}

const SELLER_NAMES = [
  "Ahmed Nabil",
  "Mona Farouk",
  "Youssef Adel",
  "Salma Ibrahim",
  "Karim El-Sayed",
  "Nour Hassan",
  "Omar Zaki",
  "Yasmin Adel",
  "Mostafa Ali",
  "Heba Mahmoud",
  "Amr Khaled",
  "Dina Samir",
  "Tarek Youssef",
  "Rania Fathy",
  "Hassan Farid",
  "Mariam Sobhy",
  "Sherif Nasser",
  "Aya Gamal",
  "Khaled Mansour",
  "Farida Wael"
];

/** Believable Egyptian seller display name, stable per real owner id (not per listing). */
export function buildSellerName(ownerId: string): string {
  return SELLER_NAMES[hashSeed(`${ownerId}-seller`) % SELLER_NAMES.length];
}

const CITY_LABELS_AR: Record<string, string> = {
  Cairo: "القاهرة",
  Giza: "الجيزة",
  Alexandria: "الإسكندرية",
  Mansoura: "المنصورة",
  Zagazig: "الزقازيق",
  "6th of October": "٦ أكتوبر"
};

const GOVERNORATE_LABELS_AR: Record<string, string> = {
  Cairo: "القاهرة",
  Giza: "الجيزة",
  Alexandria: "الإسكندرية",
  Dakahlia: "الدقهلية",
  Sharqia: "الشرقية"
};

/** City/governorate names follow the INTERFACE locale (like currency formatting), not the listing's content language. */
export function buildLocationLabel(name: string, locale: Locale, kind: "city" | "governorate" = "city"): string {
  if (locale !== "ar") {
    return name;
  }
  const table = kind === "city" ? CITY_LABELS_AR : GOVERNORATE_LABELS_AR;
  return table[name] ?? name;
}

const CATEGORY_IMAGE_FILES: Record<string, string> = {
  electronics: "electronics",
  gaming: "gaming",
  "gaming-consoles": "gaming",
  photography: "photography",
  "camera-lenses": "camera-lenses",
  furniture: "furniture",
  cars: "cars",
  motorcycles: "motorcycles",
  fashion: "fashion",
  wedding: "wedding",
  "wedding-dresses": "wedding-dresses",
  kids: "kids",
  camping: "camping",
  sports: "sports",
  construction: "construction",
  "power-tools": "construction",
  "professional-equipment": "professional-equipment",
  "event-equipment": "event-equipment",
  "musical-instruments": "musical-instruments",
  "dj-systems": "dj-systems",
  books: "books",
  pets: "pets",
  "real-estate": "real-estate",
  services: "photography",
  experiences: "experiences"
};

const GENERIC_IMAGE_FILE = "generic";

const CATEGORY_LABELS_AR: Record<string, string> = {
  electronics: "إلكترونيات",
  gaming: "ألعاب",
  "gaming-consoles": "أجهزة ألعاب",
  photography: "تصوير",
  "camera-lenses": "عدسات كاميرا",
  furniture: "أثاث",
  cars: "سيارات",
  motorcycles: "دراجات نارية",
  fashion: "أزياء",
  wedding: "مناسبات",
  "wedding-dresses": "فساتين زفاف",
  kids: "أطفال",
  camping: "تخييم",
  sports: "رياضة",
  construction: "بناء وأدوات",
  "power-tools": "أدوات كهربائية",
  "professional-equipment": "معدات احترافية",
  "event-equipment": "معدات مناسبات",
  "musical-instruments": "آلات موسيقية",
  "dj-systems": "أنظمة دي جي",
  books: "كتب",
  pets: "حيوانات أليفة",
  "real-estate": "عقارات",
  services: "خدمات",
  experiences: "تجارب"
};

/**
 * Category tile label — follows the INTERFACE locale. Unlike listing
 * titles, a category name ("Electronics") is UI chrome, not anyone's
 * content, so it must switch with the language switcher rather than being
 * pinned to Arabic.
 */
export function buildCategoryLabel(categorySlug: string, fallbackName: string, locale: Locale): string {
  if (locale !== "ar") {
    return fallbackName;
  }
  return CATEGORY_LABELS_AR[categorySlug] ?? fallbackName;
}

/** Same local asset library used for listing cards, keyed by category only (no listing id). */
export function buildCategoryImageUrl(categorySlug: string): string {
  const file = CATEGORY_IMAGE_FILES[categorySlug] ?? GENERIC_IMAGE_FILE;
  return `/demo/products/${file}.jpg`;
}

/** Local asset path — see /public/demo/products for the curated photo library. */
export function buildDemoImageUrl(listingId: string, categorySlug: string): string {
  const file = CATEGORY_IMAGE_FILES[categorySlug] ?? GENERIC_IMAGE_FILE;
  return `/demo/products/${file}.jpg`;
}

/**
 * Sponsored is a demo-only, frontend-derived visual state — never shown for
 * an unverified owner, regardless of hash outcome. Roughly 1 in 4 verified
 * listings are marked sponsored, deterministically, so the effect is stable
 * per listing rather than flickering between renders.
 */
export function isSponsoredListing(listingId: string, verificationLevel: string): boolean {
  if (verificationLevel === "UNVERIFIED") {
    return false;
  }
  return hashSeed(`${listingId}-sponsored`) % 4 === 0;
}

/**
 * The Collectors' Rare Finds page works from AI rarity-scored data that
 * doesn't carry the listing's category, so this picks a stable photo from a
 * small pool of already-curated, premium-feeling shots rather than the
 * category-keyed library above.
 */
const COLLECTIBLE_IMAGE_POOL = [
  "camera-lenses",
  "musical-instruments",
  "professional-equipment",
  "photography",
  "real-estate"
];

export function buildCollectibleImageUrl(listingId: string): string {
  const file = COLLECTIBLE_IMAGE_POOL[hashSeed(`${listingId}-collectible`) % COLLECTIBLE_IMAGE_POOL.length];
  return `/demo/products/${file}.jpg`;
}
