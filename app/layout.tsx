import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { landingAnchorScroll } from "@/src/config/landingScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wiktor Szyszkowski | Od „umiem coś” do „mówię normalnie”.",
  description:
    "Indywidualne zajęcia i kursy angielskiego. Od „umiem coś” do „mówię normalnie” — bez chaosu i bez szkolnego podejścia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" style={{ scrollPaddingTop: landingAnchorScroll.top }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased bg-linear-to-b from-sky-100 via-sky-50 to-white`}
      >
        {children}
        <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
