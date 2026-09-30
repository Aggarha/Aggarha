import type { Route } from "next";
import { redirect } from "next/navigation";
import { AdminLoginCard } from "@/components/admin/admin-login-card";
import { getOptionalSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/i18n/get-locale";

export default async function AdminLoginPage() {
  const [locale, session] = await Promise.all([getLocale(), getOptionalSession()]);

  if (session) {
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } });
    if (user?.role === "ADMIN") {
      redirect("/admin" as Route);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <AdminLoginCard lang={locale} />
    </div>
  );
}
