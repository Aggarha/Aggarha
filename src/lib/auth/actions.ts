"use server";

import crypto from "crypto";
import type { Route } from "next";
import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, revokeSession, setSessionCookie, clearSessionCookie, getOptionalSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { env } from "@/lib/env";

export type AuthActionState = { error?: string } | undefined;

const RESET_TOKEN_TTL_HOURS = 1;

const ERRORS = {
  en: {
    invalidInput: "Please fill in all fields correctly.",
    invalidCredentials: "Incorrect email/phone or password.",
    passwordTooShort: "Password must be at least 8 characters.",
    passwordMismatch: "Passwords don't match.",
    accountExists: "An account with this email or phone already exists.",
    accountNotFound: "No account found with that email or phone.",
    googleOnlyAccount: "This account uses Google sign-in — there's no password to reset.",
    resetTokenInvalid: "This reset link is invalid or has expired. Request a new one."
  },
  ar: {
    invalidInput: "يرجى ملء جميع الحقول بشكل صحيح.",
    invalidCredentials: "البريد الإلكتروني أو الهاتف أو كلمة المرور غير صحيحة.",
    passwordTooShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    passwordMismatch: "كلمتا المرور غير متطابقتين.",
    accountExists: "يوجد حساب بالفعل بهذا البريد الإلكتروني أو رقم الهاتف.",
    accountNotFound: "لا يوجد حساب بهذا البريد الإلكتروني أو رقم الهاتف.",
    googleOnlyAccount: "هذا الحساب يستخدم تسجيل الدخول عبر جوجل — لا توجد كلمة مرور لإعادة تعيينها.",
    resetTokenInvalid: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية. اطلب رابطًا جديدًا."
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

const requestResetSchema = z.object({
  identifier: z.string().trim().min(3)
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
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

export type RequestResetState = { error?: string; resetLink?: string } | undefined;

/**
 * Demo-mode: returns the reset link directly instead of emailing it, since there's
 * no email provider wired up yet. Swap the return/log for a real send once one is —
 * the token/expiry storage and resetPasswordAction below don't need to change.
 */
export async function requestPasswordResetAction(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const locale = await getLocale();
  const copy = ERRORS[locale];

  const parsed = requestResetSchema.safeParse({ identifier: formData.get("identifier") });
  if (!parsed.success) {
    return { error: copy.invalidInput };
  }

  const { identifier } = parsed.data;
  const user = await prisma.user.findUnique({
    where: isEmail(identifier) ? { email: identifier } : { phone: identifier }
  });

  if (!user) {
    return { error: copy.accountNotFound };
  }

  // TODO: once Google sign-in ships, accounts created via OAuth will also have a
  // null passwordHash — this message is already correct for that case, no change needed.
  if (!user.passwordHash) {
    return { error: copy.googleOnlyAccount };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry }
  });

  const resetLink = `${env.APP_URL}/reset-password?token=${resetToken}`;
  console.log(`[demo-mode] password reset link for ${identifier}: ${resetLink}`);

  return { resetLink };
}

export async function resetPasswordAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const locale = await getLocale();
  const copy = ERRORS[locale];

  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });
  if (!parsed.success) {
    const tooShort = parsed.error.issues.some((issue) => issue.path[0] === "password");
    return { error: tooShort ? copy.passwordTooShort : copy.invalidInput };
  }

  const { token, password, confirmPassword } = parsed.data;
  if (password !== confirmPassword) {
    return { error: copy.passwordMismatch };
  }

  const user = await prisma.user.findUnique({ where: { resetToken: token } });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return { error: copy.resetTokenInvalid };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null }
  });

  redirect("/login?reset=success" as Route);
}
