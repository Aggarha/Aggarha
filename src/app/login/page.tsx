import type { Route } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { getOptionalSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

function safeNextPath(value: string | undefined): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const [{ locale }, session, { next, reset }] = await Promise.all([
    getLocaleAndDictionary(),
    getOptionalSession(),
    searchParams
  ]);

  const nextPath = safeNextPath(next);

  if (session) {
    redirect(nextPath as Route);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <AuthCard lang={locale} next={nextPath} resetSuccess={reset === "success"} />
    </div>
  );
}
