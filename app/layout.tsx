import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/config";
import { LiveChat } from "@/components/LiveChat";
import { Tracker } from "@/components/Tracker";

const display = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: `${BRAND.nameAr} | ${BRAND.tagline}`,
  description:
    "اطلب عروض نقل عفش مجانية في جدة والسعودية — نربطك بشركات نقل معتمدة بسرعة.",
  icons: { icon: "/icon.png" },
  metadataBase: new URL("https://naqlisa.netlify.app"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <Tracker />
        <LiveChat />
        {children}
      </body>
    </html>
  );
}
