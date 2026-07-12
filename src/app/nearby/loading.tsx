import { SkeletonBlock } from "@/components/premium/system";

export default function NearbyLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-9 w-40" />
      <SkeletonBlock className="h-11 rounded-full" />
      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-96 rounded-3xl" />
          ))}
        </div>
        <SkeletonBlock className="h-[420px] rounded-3xl" />
      </div>
    </div>
  );
}
