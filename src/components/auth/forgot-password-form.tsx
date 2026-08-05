"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/lib/auth/actions";
import { PremiumButton, PremiumCard, PremiumInput } from "@/components/premium/system";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    eyebrow: "Reset your password",
    title: "Forgot your password?",
    description: "Enter the email or phone you signed up with and we'll send you a reset link.",
    emailOrPhone: "Email or phone",
    emailOrPhonePlaceholder: "you@example.com or 010xxxxxxxx",
    submit: "Send reset link",
    pending: "Sending…",
    backToLogin: "Back to log in",
    demoLinkLabel: "Demo mode — no email provider is wired up yet, so here's your reset link:"
  },
  ar: {
    eyebrow: "إعادة تعيين كلمة المرور",
    title: "نسيت كلمة المرور؟",
    description: "أدخل البريد الإلكتروني أو رقم الهاتف الذي سجّلت به وسنرسل لك رابط إعادة التعيين.",
    emailOrPhone: "البريد الإلكتروني أو الهاتف",
    emailOrPhonePlaceholder: "you@example.com أو 010xxxxxxxx",
    submit: "إرسال رابط إعادة التعيين",
    pending: "جارٍ الإرسال…",
    backToLogin: "العودة لتسجيل الدخول",
    demoLinkLabel: "وضع تجريبي — لا يوجد مزود بريد إلكتروني بعد، إليك رابط إعادة التعيين:"
  }
};

export function ForgotPasswordForm({ lang = "en" }: { lang?: Locale }) {
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, undefined);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto w-full max-w-md">
      <PremiumCard className="space-y-5 bg-[#151515]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{copy.eyebrow}</p>
          <h1 className="text-2xl font-black tracking-tight text-white">{copy.title}</h1>
          <p className="text-sm text-white/55">{copy.description}</p>
        </div>

        <form action={formAction} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.emailOrPhone}</span>
            <PremiumInput type="text" name="identifier" placeholder={copy.emailOrPhonePlaceholder} required />
          </label>

          {state?.error ? <p className="text-center text-xs font-semibold text-[#ff9a8a]">{state.error}</p> : null}

          <PremiumButton type="submit" tone="primary" disabled={pending} className="w-full">
            {pending ? copy.pending : copy.submit}
          </PremiumButton>
        </form>

        {state?.resetLink ? (
          <div className="space-y-1.5 rounded-2xl border border-[#ccff00]/30 bg-[#ccff00]/[0.06] p-3">
            <p className="text-xs font-semibold text-[#eaff95]">{copy.demoLinkLabel}</p>
            <a href={state.resetLink} className="block break-all text-xs text-[#ccff00] underline">
              {state.resetLink}
            </a>
          </div>
        ) : null}

        {state?.message ? (
          <p className="rounded-2xl border border-[#ccff00]/30 bg-[#ccff00]/[0.06] p-3 text-center text-xs font-semibold text-[#eaff95]">
            {state.message}
          </p>
        ) : null}

        <p className="text-center text-xs text-white/50">
          <Link href="/login" className="font-semibold text-[#ccff00] hover:text-[#deff57]">
            {copy.backToLogin}
          </Link>
        </p>
      </PremiumCard>
    </div>
  );
}
