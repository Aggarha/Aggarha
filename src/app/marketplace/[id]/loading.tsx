import { SkeletonBlock } from "@/components/premium/system";

export default function ListingDetailsLoading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="space-y-4 rounded-[2rem] border border-white/[0.08] bg-[#121212] p-4 sm:p-6">
        <SkeletonBlock className="h-6 w-2/3" />
        <SkeletonBlock className="h-9 w-1/2" />
        <div className="grid gap-3 md:grid-cols-4">
          <SkeletonBlock className="h-64 rounded-2xl md:col-span-2 md:h-[28rem]" />
          <div className="grid gap-3 sm:grid-cols-2 md:col-span-2 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-32 rounded-2xl sm:h-48 md:h-[13.6rem]" />
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-5">
          <SkeletonBlock className="h-40 rounded-3xl" />
          <SkeletonBlock className="h-56 rounded-3xl" />
          <SkeletonBlock className="h-48 rounded-3xl" />
        </div>
        <SkeletonBlock className="h-80 rounded-3xl" />
      </section>
    </div>
  );
}
