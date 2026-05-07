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
    "angielski bez stresu",
    "angielski",
    "nauka angielskiego",
    "język angielski",
    "kurs angielskiego",
    "kursy angielskiego online",
    "kurs speaking",
    "korepetycje z angielskiego",
    "korepetycje angielski online",
    "lekcje angielskiego",
    "nauczyciel angielskiego",
    "konwersacje po angielsku",
    "mówienie po angielsku",
    "przełamanie bariery językowej",
    "angielski dla początkujących",
    "angielski dla dorosłych",
    "przygotowanie do matury angielski",
    "indywidualne zajęcia angielski",
    "korepetycje",
    "kursy angielskiego",
    "speaking",
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
    title: "Wiktor Szyszkowski | Od „umiem coś” do „mówię normalnie”.",
    description:
      "Indywidualne zajęcia i kursy angielskiego. Od „umiem coś” do „mówię normalnie” — bez chaosu i bez szkolnego podejścia.",
    images: ["/wikus4.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wiktor Szyszkowski | Od „umiem coś” do „mówię normalnie”.",
    description:
      "Indywidualne zajęcia i kursy angielskiego. Od „umiem coś” do „mówię normalnie” — bez chaosu i bez szkolnego podejścia.",
    images: ["/wikus4.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4318931438424156');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=4318931438424156&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
        <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
