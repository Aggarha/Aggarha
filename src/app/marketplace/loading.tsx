import { SkeletonBlock } from "@/components/premium/system";

export default function MarketplaceLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-4 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-16 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-96 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
