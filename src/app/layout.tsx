import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileBottomNav } from "@/components/premium/system";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { dirFor } from "@/lib/i18n/types";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aggarha.com"),
  title: "Aggarha",
  description: "Premium marketplace experience for rentals and exchanges in Egypt",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aggarha"
  },
  openGraph: {
    title: "Aggarha",
    description: "Premium marketplace experience for rentals and exchanges in Egypt",
    url: "https://www.aggarha.com",
    siteName: "Aggarha",
    type: "website"
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#ccff00",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, t } = await getLocaleAndDictionary();

  return (
    <html lang={locale} dir={dirFor(locale)} className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteHeader locale={locale} t={t} />
        <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
        <MobileBottomNav locale={locale} t={t} />
        <SiteFooter locale={locale} t={t} />
      </body>
    </html>
  );
}
