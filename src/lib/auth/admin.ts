"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie, getOptionalSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { checkRateLimit } from "@/lib/rate-limit";

export type AdminAuthActionState = { error?: string } | undefined;

const ERRORS = {
  en: {
    invalidInput: "Please fill in all fields correctly.",
    invalidCredentials: "Incorrect email/phone or password.",
    notAuthorized: "You are not authorized to access this area.",
    tooManyAttempts: "Too many attempts. Please try again in a few minutes."
  },
  ar: {
    invalidInput: "يرجى ملء جميع الحقول بشكل صحيح.",
    invalidCredentials: "البريد الإلكتروني أو الهاتف أو كلمة المرور غير صحيحة.",
    notAuthorized: "غير مصرح لك بالدخول.",
    tooManyAttempts: "محاولات كثيرة جدًا. يرجى المحاولة مرة أخرى بعد دقائق قليلة."
  }
};

const adminLoginSchema = z.object({
  identifier: z.string().trim().min(3),
  password: z.string().min(1)
});

function isEmail(identifier: string): boolean {
  return identifier.includes("@");
}

export async function adminLoginAction(
  _prevState: AdminAuthActionState,
  formData: FormData
): Promise<AdminAuthActionState> {
  const locale = await getLocale();
  const copy = ERRORS[locale];

  const { limited } = await checkRateLimit({ route: "admin-login", limit: 5, windowMinutes: 15 });
  if (limited) {
    return { error: copy.tooManyAttempts };
  }

  const parsed = adminLoginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: copy.invalidInput };
  }

  const { identifier, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: isEmail(identifier) ? { email: identifier } : { phone: identifier }
  });

  if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return { error: copy.invalidCredentials };
  }

  if (user.role !== "ADMIN") {
    return { error: copy.notAuthorized };
  }

  const session = await createSession(user.id);
  await setSessionCookie(session);
  redirect("/admin" as Route);
}

/** The authoritative auth+role check for /admin pages. Middleware only checks cookie presence (Edge-safe, no DB access); this does the real DB-backed session + role validation. */
export async function requireAdminSession(): Promise<{ userId: string }> {
  const session = await getOptionalSession();
  if (!session) {
    redirect("/admin/login" as Route);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true }
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login" as Route);
  }

  return { userId: user.id };
}
