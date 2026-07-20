"use server";

import type { Route } from "next";
import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, revokeSession, setSessionCookie, clearSessionCookie, getOptionalSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";

export type AuthActionState = { error?: string } | undefined;

const ERRORS = {
  en: {
    invalidInput: "Please fill in all fields correctly.",
    invalidCredentials: "Incorrect email/phone or password.",
    passwordTooShort: "Password must be at least 8 characters.",
    passwordMismatch: "Passwords don't match.",
    accountExists: "An account with this email or phone already exists."
  },
  ar: {
    invalidInput: "يرجى ملء جميع الحقول بشكل صحيح.",
    invalidCredentials: "البريد الإلكتروني أو الهاتف أو كلمة المرور غير صحيحة.",
    passwordTooShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    passwordMismatch: "كلمتا المرور غير متطابقتين.",
    accountExists: "يوجد حساب بالفعل بهذا البريد الإلكتروني أو رقم الهاتف."
  }
};

const loginSchema = z.object({
  identifier: z.string().trim().min(3),
  password: z.string().min(1)
});

const signupSchema = z.object({
  name: z.string().trim().min(1),
  identifier: z.string().trim().min(3),
  password: z.string().min(8),
  confirmPassword: z.string().min(1)
});

function isEmail(identifier: string): boolean {
  return identifier.includes("@");
}

function safeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

async function generateUniqueHandle(name: string): Promise<string> {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "user";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const existing = await prisma.profile.findUnique({ where: { handle: candidate } });
    if (!existing) {
      return candidate;
    }
  }

  return `${base}-${Date.now()}`;
}

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const locale = await getLocale();
  const copy = ERRORS[locale];

  const parsed = loginSchema.safeParse({
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

  const session = await createSession(user.id);
  await setSessionCookie(session);
  redirect(safeNextPath(formData.get("next")) as Route);
}

export async function signupAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const locale = await getLocale();
  const copy = ERRORS[locale];

  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    identifier: formData.get("identifier"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    const tooShort = parsed.error.issues.some((issue) => issue.path[0] === "password");
    return { error: tooShort ? copy.passwordTooShort : copy.invalidInput };
  }

  const { name, identifier, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return { error: copy.passwordMismatch };
  }

  const email = isEmail(identifier) ? identifier : undefined;
  const phone = isEmail(identifier) ? undefined : identifier;

  const existing = await prisma.user.findFirst({
    where: { OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter((clause) => clause !== undefined) }
  });

  if (existing) {
    return { error: copy.accountExists };
  }

  const [passwordHash, handle] = await Promise.all([hashPassword(password), generateUniqueHandle(name)]);

  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash,
      profile: {
        create: {
          handle,
          displayName: name
        }
      }
    }
  });

  const session = await createSession(user.id);
  await setSessionCookie(session);
  redirect(safeNextPath(formData.get("next")) as Route);
}

export async function logoutAction(): Promise<void> {
  const session = await getOptionalSession();
  if (session) {
    await revokeSession(session.sessionToken);
  }
  await clearSessionCookie();
  redirect("/login");
}
