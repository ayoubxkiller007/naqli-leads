import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/config";
import { Tracker } from "@/components/Tracker";

const LiveChat = dynamic(
  () => import("@/components/LiveChat").then((m) => m.LiveChat),
  { ssr: false }
);

const display = Cairo({
  subsets: ["arabic"],
  weight: ["800"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
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
