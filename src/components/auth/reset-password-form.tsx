"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/auth/actions";
import { PremiumButton, PremiumCard, PremiumInput } from "@/components/premium/system";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    eyebrow: "Reset your password",
    title: "Choose a new password",
    password: "New password",
    passwordPlaceholder: "Enter a new password",
    confirmPassword: "Confirm new password",
    confirmPasswordPlaceholder: "Re-enter your new password",
    submit: "Reset password",
    pending: "Resetting…",
    backToLogin: "Back to log in"
  },
  ar: {
    eyebrow: "إعادة تعيين كلمة المرور",
    title: "اختر كلمة مرور جديدة",
    password: "كلمة المرور الجديدة",
    passwordPlaceholder: "أدخل كلمة مرور جديدة",
    confirmPassword: "تأكيد كلمة المرور الجديدة",
    confirmPasswordPlaceholder: "أعد إدخال كلمة المرور الجديدة",
    submit: "إعادة تعيين كلمة المرور",
    pending: "جارٍ إعادة التعيين…",
    backToLogin: "العودة لتسجيل الدخول"
  }
};

export function ResetPasswordForm({ token, lang = "en" }: { token: string; lang?: Locale }) {
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto w-full max-w-md">
      <PremiumCard className="space-y-5 bg-[#151515]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{copy.eyebrow}</p>
          <h1 className="text-2xl font-black tracking-tight text-white">{copy.title}</h1>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.password}</span>
            <PremiumInput type="password" name="password" placeholder={copy.passwordPlaceholder} required />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.confirmPassword}</span>
            <PremiumInput type="password" name="confirmPassword" placeholder={copy.confirmPasswordPlaceholder} required />
          </label>

          {state?.error ? <p className="text-center text-xs font-semibold text-[#ff9a8a]">{state.error}</p> : null}

          <PremiumButton type="submit" tone="primary" disabled={pending} className="w-full">
            {pending ? copy.pending : copy.submit}
          </PremiumButton>
        </form>

        <p className="text-center text-xs text-white/50">
          <Link href="/login" className="font-semibold text-[#ccff00] hover:text-[#deff57]">
            {copy.backToLogin}
          </Link>
        </p>
      </PremiumCard>
    </div>
  );
}
