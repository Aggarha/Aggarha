import { SkeletonBlock } from "@/components/premium/system";

export default function PlaystationLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-64 rounded-[2rem] sm:h-80" />
      {Array.from({ length: 4 }).map((_, rowIndex) => (
        <div key={rowIndex} className="space-y-4">
          <SkeletonBlock className="h-6 w-40 rounded-lg" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-80 w-64 shrink-0 rounded-3xl sm:w-72" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
