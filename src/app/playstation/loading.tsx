import { SkeletonBlock } from "@/components/premium/system";

export default function PlaystationLoading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <SkeletonBlock className="h-72 rounded-[2rem]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-72 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
