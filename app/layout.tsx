import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "marwaazpn.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: "Nootaayada Marwaaz Baydhabo | Nootaayada Ugu Fiican Baydhabo | Marwaaz Public Notary",
    description: "Nootaayada Marwaaz waa nootaayada ugu fiican Baydhabo. Waxaan bixinnaa adeegyada rasmiga ah ee nootaayada, kala wareejinta hantida, dhulka, baabuurta iyo heshiisyada sharciga ah ee Baydhabo, Soomaaliya.",
    keywords: [
      "marwaaz",
      "nootaayo marwaaz",
      "nootaayada marwaaz",
      "nootaayada ugu fiican baydhabo",
      "nootaayo baydhabo",
      "nootaayada baydhabo",
      "marwaaz public notary",
      "public notary Baidoa",
      "notary Somalia",
      "kala wareejinta dhulka baydhabo"
    ],
    alternates: { canonical: origin },
    icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
    openGraph: {
      type: "website",
      url: origin,
      siteName: "Nootaayada Marwaaz Baydhabo",
      title: "Nootaayada Marwaaz | Nootaayada Ugu Fiican Baydhabo",
      description: "Adeegyada rasmiga ah ee Nootaayada Marwaaz — Baydhabo, Soomaaliya. Kala wareejinta hantida, diyaarinta heshiisyada iyo sharciyeynta.",
      locale: "so_SO",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Nootaayada Marwaaz Baydhabo" }]
    },
    twitter: { card: "summary_large_image", title: "Nootaayada Marwaaz | Baydhabo", description: "Nootaayada ugu fiican Baydhabo — Marwaaz Public Notary", images: [`${origin}/og.png`] },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="so" suppressHydrationWarning><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
