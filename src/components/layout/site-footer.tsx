export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#090909]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-2">
          <p className="font-semibold uppercase tracking-[0.16em] text-white/75">Aggarha</p>
          <p className="text-xs text-white/58">Premium rental and swap marketplace with AI ranking, trust analytics, and nearby discovery.</p>
        </div>
        <div className="space-y-2 text-xs text-white/62">
          <p className="font-semibold uppercase tracking-[0.14em] text-white/72">Explore</p>
          <p>Marketplace</p>
          <p>Collectibles Exchange</p>
          <p>PlayStation Exchange</p>
        </div>
        <div className="space-y-2 text-xs text-white/62">
          <p className="font-semibold uppercase tracking-[0.14em] text-white/72">Trust</p>
          <p>Verified sellers and renters</p>
          <p>AI trust insights placeholder</p>
          <p>Fraud signals and safety controls</p>
        </div>
        <div className="space-y-2 text-xs text-white/62">
          <p className="font-semibold uppercase tracking-[0.14em] text-white/72">App</p>
          <p>PWA install-ready</p>
          <p>Mobile bottom navigation</p>
          <p>Optimized dark-first experience</p>
        </div>
      </div>
    </footer>
  );
}
