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
  metadataBase: new URL("https://wiktorszyszkowski.pl"),
  title: "Wiktor Szyszkowski | Od „umiem coś” do „mówię normalnie”.",
  description:
    "Indywidualne zajęcia i kursy angielskiego. Od „umiem coś” do „mówię normalnie” — bez chaosu i bez szkolnego podejścia.",
  keywords: [
    "Wiktor Szyszkowski",
    "Szycha",
    "angielski",
    "korepetycje",
    "kursy angielskiego",
    "speaking",
    "przełamanie bariery",
    "aniszewski-code.pl",
    "Wojciech Aniszewski",
    "aniszewski code",
    "freelance web developer",
    "wilczynska.visuals",
    "martyna wilczynska",
    "design",
  ],
  authors: [
    { name: "Wojciech Aniszewski (aniszewski-code.pl)", url: "https://aniszewski-code.pl" },
    { name: "Martyna Wilczyńska (wilczynska.visuals)", url: "mailto:wilczynska.visuals@gmail.com" },
  ],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://wiktorszyszkowski.pl",
    title: "Wiktor Szyszkowski | Od „umiem coś” do „mówię normalnie”.",
    description:
      "Indywidualne zajęcia i kursy angielskiego. Od „umiem coś” do „mówię normalnie” — bez chaosu i bez szkolnego podejścia.",
    siteName: "Wiktor Szyszkowski",
    images: [
      {
        url: "/wikus4.png",
        width: 1200,
        height: 630,
        alt: "Wiktor Szyszkowski - Angielski bez stresu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wiktor Szyszkowski | Od „umiem coś” do „mówię normalnie”.",
    description:
      "Indywidualne zajęcia i kursy angielskiego. Od „umiem coś” do „mówię normalnie” — bez chaosu i bez szkolnego podejścia.",
    images: ["/wikus4.png"],
  },
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
