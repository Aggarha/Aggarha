import { ListingCard } from "@/components/marketplace/listing-card";
import {
  EmptyState,
  MapPanel,
  PremiumButton,
  PremiumInput,
  SectionHeader
} from "@/components/premium/system";
import { runNearbyIntelligence } from "@/lib/ai";
import { listingCardData } from "@/lib/marketplace/serializers";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NearbyPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const governorate = firstValue(params.governorate);
  const city = firstValue(params.city);

  const nearby = await runNearbyIntelligence({ location: { governorate, city } });

  const groups = [
    { label: "Nearby Rentals", items: nearby.rentals },
    { label: "Nearby Swaps", items: nearby.swaps },
    { label: "Nearby Collectibles", items: nearby.collectibles },
    { label: "Nearby Gaming", items: nearby.gaming },
    { label: "Nearby Cameras", items: nearby.cameras },
    { label: "Nearby Electronics", items: nearby.electronics },
    { label: "Nearby Cars", items: nearby.cars },
    { label: "Nearby Musical Instruments", items: nearby.musicalInstruments },
    { label: "Nearby Event Equipment", items: nearby.eventEquipment }
  ];

  const hasResults = groups.some((group) => group.items.length > 0);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <SectionHeader
        level={1}
        eyebrow="Nearby Around You"
        title="Discover inventory near your current area"
        subtitle="AI nearby discovery ranked by trust, freshness, and category demand."
      />

      <form className="grid gap-3 rounded-3xl border border-white/[0.07] bg-[#141414] p-4 sm:grid-cols-[1fr_1fr_auto]">
        <PremiumInput
          type="text"
          name="governorate"
          aria-label="Governorate"
          defaultValue={governorate ?? ""}
          placeholder="Governorate"
        />
        <PremiumInput
          type="text"
          name="city"
          aria-label="City"
          defaultValue={city ?? ""}
          placeholder="City"
        />
        <PremiumButton type="submit" tone="primary" className="w-full sm:w-auto">
          Update Area
        </PremiumButton>
      </form>

      <MapPanel
        title={`Nearby marketplace map${city ? ` in ${city}` : ""}`}
        layers={groups.map((group) => group.label)}
      />

      {!hasResults ? (
        <EmptyState
          title="No nearby inventory yet"
          description="Try a different city or governorate."
        />
      ) : (
        groups
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <section key={group.label} className="space-y-4">
              <SectionHeader eyebrow="Nearby" title={group.label} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {group.items.map((listing) => (
                  <ListingCard key={listing.id} {...listingCardData(listing)} />
                ))}
              </div>
            </section>
          ))
      )}
    </div>
  );
}
