import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileBottomNav } from "@/components/premium/system";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
        <MobileBottomNav />
        <SiteFooter />
      </body>
    </html>
  );
}
