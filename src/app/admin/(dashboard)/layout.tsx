import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdminSession } from "@/lib/auth/admin";
import { getLocale } from "@/lib/i18n/get-locale";

export default async function AdminDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [, locale] = await Promise.all([requireAdminSession(), getLocale()]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-12">
      <AdminSidebar lang={locale} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
