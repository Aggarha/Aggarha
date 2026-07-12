import { SkeletonBlock } from "@/components/premium/system";

export default function AIDashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-40 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-24 rounded-3xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-56 rounded-3xl" />
        <SkeletonBlock className="h-56 rounded-3xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
