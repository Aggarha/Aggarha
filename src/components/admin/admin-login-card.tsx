"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/lib/auth/admin";
import { PremiumButton, PremiumCard, PremiumInput } from "@/components/premium/system";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    eyebrow: "Aggarha Admin",
    title: "Admin sign in",
    emailOrPhone: "Email or phone",
    emailOrPhonePlaceholder: "admin@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    cta: "Log in",
    pending: "Logging in…"
  },
  ar: {
    eyebrow: "لوحة تحكم اجّرها",
    title: "تسجيل دخول الأدمن",
    emailOrPhone: "البريد الإلكتروني أو الهاتف",
    emailOrPhonePlaceholder: "admin@example.com",
    password: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    cta: "تسجيل الدخول",
    pending: "جارٍ تسجيل الدخول…"
  }
};

export function AdminLoginCard({ lang = "en" }: { lang?: Locale }) {
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const [state, formAction, pending] = useActionState(adminLoginAction, undefined);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto w-full max-w-md">
      <PremiumCard className="space-y-5 bg-[#151515]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{copy.eyebrow}</p>
          <h1 className="text-2xl font-black tracking-tight text-white">{copy.title}</h1>
        </div>

        <form action={formAction} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.emailOrPhone}</span>
            <PremiumInput type="text" name="identifier" placeholder={copy.emailOrPhonePlaceholder} required />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.password}</span>
            <PremiumInput type="password" name="password" placeholder={copy.passwordPlaceholder} required />
          </label>

          {state?.error ? <p className="text-center text-xs font-semibold text-[#ff9a8a]">{state.error}</p> : null}

          <PremiumButton type="submit" tone="primary" disabled={pending} className="w-full">
            {pending ? copy.pending : copy.cta}
          </PremiumButton>
        </form>
      </PremiumCard>
    </div>
  );
}
