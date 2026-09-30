import { requireAdminSession } from "@/lib/auth/admin";

export default async function AdminHomePage() {
  await requireAdminSession();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-black tracking-tight text-white">Admin</h1>
    </div>
  );
}
