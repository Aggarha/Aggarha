import { SkeletonBlock } from "@/components/premium/system";

export default function HomeLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      {/* Sponsored billboard */}
      <SkeletonBlock className="h-[62vh] max-h-[560px] min-h-[380px] rounded-[2rem]" />

      {/* Top Rented shelf */}
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-32 rounded-lg" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-96 w-64 shrink-0 rounded-3xl sm:w-72" />
          ))}
        </div>
      </div>

      {/* Top Swapped shelf */}
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-32 rounded-lg" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-96 w-64 shrink-0 rounded-3xl sm:w-72" />
          ))}
        </div>
      </div>

      {/* Sponsored Listings grid */}
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-40 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-96 rounded-3xl" />
          ))}
        </div>
      </div>

      {/* Popular Categories tile grid */}
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-40 rounded-lg" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock key={index} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
