# Design System

> **Implementation status: Implemented** (component library in active use). This document did not exist before this refactor; it documents `src/components/premium/system.tsx`, added/expanded in commits `4ac2c77` ("build premium UX and design system") and `a161c2e` ("polish premium homepage wow pass") with no prior documentation.

## 1. Purpose
A single-file component library (`src/components/premium/system.tsx`, 416 lines, 29 exported components) implementing Aggarha's premium visual language, matching the "Airbnb, Apple, Stripe, Discord, Steam"-inspired experience goal in [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md) §2. Built with Tailwind utility classes (via `cn()` from `src/lib/cn.ts`), dark theme, lime accent (`#ccff00`), rounded-2xl surfaces.

## 2. Component Inventory
| Category | Components |
|---|---|
| Actions | `PremiumButton` (primary/secondary/ghost tones) |
| Surfaces | `PremiumCard`, `ModalPanel`, `BottomSheet` |
| Layout/Section | `SectionHeader`, `HeroBanner`, `HeroAdsSlider`, `MobileBottomNav` |
| Search & Filters | `SearchBar`, `FilterPanel`, `PremiumSelect`, `PremiumInput` |
| Badges & Tags | `Tag`, `PremiumBadge`, `TrustBadge`, `VerificationBadgePill` |
| Listing/Marketplace | `OwnerCard`, `ReviewCard`, `StickyBookingCard`, `PremiumCalendar`, `NearbyCard` |
| Domain-specific | `CollectibleCard`, `PlayStationCard`, `RecommendationCard` |
| Data display | `StatsCard`, `MapPanel` |
| Feedback/utility | `TooltipHint`, `SkeletonBlock`, `EmptyState` |

## 3. Design Tokens
No separate token module exists — colors and spacing are inlined as Tailwind arbitrary values within components (e.g. `bg-[#ccff00]`, `rounded-2xl`, `border-white/10`). Extracting these into a shared token file (e.g. `tailwind.config.ts` theme extension) is a natural next step but is **not currently done**.

## 4. Usage
Consumed by `src/app/page.tsx`, `src/app/marketplace/[id]/page.tsx`, `src/components/marketplace/listing-card.tsx`, and the site header/footer. Not yet used by the AI dashboard (`src/app/ai/dashboard`), which has its own styling.

## 5. Cross-References
- Product experience goals: [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md) §6
- Master status index: [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md)
