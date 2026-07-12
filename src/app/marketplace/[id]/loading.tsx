import { SkeletonBlock } from "@/components/premium/system";

export default function ListingDetailsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="space-y-5 rounded-[2rem] border border-white/[0.08] bg-[#121212] p-4 sm:p-6">
        <SkeletonBlock className="h-80 rounded-[1.75rem] sm:h-96 md:h-[32rem]" />
        <SkeletonBlock className="h-9 w-2/3" />
        <SkeletonBlock className="h-12 w-1/3" />
      </section>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <SkeletonBlock className="h-6 w-32 rounded-lg" />
          <SkeletonBlock className="h-40 rounded-3xl" />
        </div>
      ))}
    </div>
  );
}
