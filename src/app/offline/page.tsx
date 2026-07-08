import { PremiumBadge } from "@/components/premium/system";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <PremiumBadge>No Connection</PremiumBadge>
      <h1 className="text-3xl font-black text-white sm:text-4xl">You&apos;re offline right now.</h1>
      <p className="max-w-md text-sm text-white/65">
        Aggarha needs a connection to load live listings, trust scores, and AI recommendations.
        Reconnect and this page will pick up right where you left off.
      </p>
    </div>
  );
}
