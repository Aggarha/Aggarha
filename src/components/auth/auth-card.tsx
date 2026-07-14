"use client";

import { useState } from "react";
import { PremiumButton, PremiumCard, PremiumInput } from "@/components/premium/system";
import type { Locale } from "@/lib/i18n/types";

type AuthTab = "login" | "signup";

const COPY = {
  en: {
    login: "Log in",
    signup: "Sign up",
    emailOrPhone: "Email or phone",
    emailOrPhonePlaceholder: "you@example.com or 010xxxxxxxx",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
    name: "Full name",
    namePlaceholder: "Your full name",
    forgotPassword: "Forgot password?",
    loginCta: "Log in",
    signupCta: "Create account",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    switchToSignup: "Sign up",
    switchToLogin: "Log in",
    eyebrow: "Welcome to Aggarha",
    loginTitle: "Log in to your account",
    signupTitle: "Create your account",
    terms: "By continuing you agree to Aggarha's Terms and Privacy Policy."
  },
  ar: {
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    emailOrPhone: "البريد الإلكتروني أو الهاتف",
    emailOrPhonePlaceholder: "you@example.com أو 010xxxxxxxx",
    password: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
    name: "الاسم الكامل",
    namePlaceholder: "اسمك الكامل",
    forgotPassword: "نسيت كلمة المرور؟",
    loginCta: "تسجيل الدخول",
    signupCta: "إنشاء الحساب",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    switchToSignup: "إنشاء حساب",
    switchToLogin: "تسجيل الدخول",
    eyebrow: "أهلاً بك في اجّرها",
    loginTitle: "سجّل الدخول إلى حسابك",
    signupTitle: "أنشئ حسابك",
    terms: "بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة باجّرها."
  }
};

export function AuthCard({ lang = "en" }: { lang?: Locale }) {
  const [tab, setTab] = useState<AuthTab>("login");
  const isRtl = lang === "ar";
  const copy = COPY[lang];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto w-full max-w-md">
      <PremiumCard className="space-y-5 bg-[#151515]">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{copy.eyebrow}</p>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {tab === "login" ? copy.loginTitle : copy.signupTitle}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/[0.08] bg-[#101010] p-1">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`min-h-[40px] rounded-xl text-sm font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
              tab === "login" ? "bg-[#ccff00] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {copy.login}
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`min-h-[40px] rounded-xl text-sm font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
              tab === "signup" ? "bg-[#ccff00] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {copy.signup}
          </button>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="space-y-4 [animation:revealUp_.3s_ease_both]"
          key={tab}
        >
          {tab === "signup" ? (
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-white/60">{copy.name}</span>
              <PremiumInput type="text" name="name" placeholder={copy.namePlaceholder} required />
            </label>
          ) : null}

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.emailOrPhone}</span>
            <PremiumInput type="text" name="identifier" placeholder={copy.emailOrPhonePlaceholder} required />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.password}</span>
            <PremiumInput type="password" name="password" placeholder={copy.passwordPlaceholder} required />
          </label>

          {tab === "signup" ? (
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-white/60">{copy.confirmPassword}</span>
              <PremiumInput type="password" name="confirmPassword" placeholder={copy.confirmPasswordPlaceholder} required />
            </label>
          ) : null}

          {tab === "login" ? (
            <div className="flex justify-end">
              <a href="#" className="text-xs font-semibold text-white/55 transition-colors hover:text-[#ccff00]">
                {copy.forgotPassword}
              </a>
            </div>
          ) : null}

          <PremiumButton type="submit" tone="primary" className="w-full">
            {tab === "login" ? copy.loginCta : copy.signupCta}
          </PremiumButton>
        </form>

        <p className="text-center text-xs text-white/50">
          {tab === "login" ? copy.noAccount : copy.hasAccount}{" "}
          <button
            type="button"
            onClick={() => setTab(tab === "login" ? "signup" : "login")}
            className="font-semibold text-[#ccff00] hover:text-[#deff57]"
          >
            {tab === "login" ? copy.switchToSignup : copy.switchToLogin}
          </button>
        </p>

        <p className="text-center text-[11px] text-white/35">{copy.terms}</p>
      </PremiumCard>
    </div>
  );
}
