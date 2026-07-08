import { SkeletonBlock } from "@/components/premium/system";

export default function MarketplaceLoading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-32 rounded-[2rem]" />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <SkeletonBlock className="h-64 rounded-3xl" />
        <SkeletonBlock className="h-64 rounded-3xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-24 rounded-3xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-72 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
