import { SkeletonBlock } from "@/components/premium/system";

export default function FeaturedLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-9 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-96 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
