import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "marwaaznotary.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: "Marwaaz Public Notary | Baidoa, Somalia",
    description: "Adeegyada nootaayada rasmiga ah, kala wareejinta hantida, diyaarinta heshiisyada iyo mucaamalaadka sharciga ah ee Baydhabo, Soomaaliya.",
    keywords: ["public notary Baidoa", "notary Somalia", "document authentication", "contract notarization", "certified copies"],
    alternates: { canonical: origin },
    icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
    openGraph: { type: "website", url: origin, siteName: "Marwaaz Public Notary", title: "Marwaaz Public Notary", description: "Adeegyo nootaayo oo lagu kalsoonaan karo — Baydhabo, Soomaaliya", locale: "so_SO", images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Marwaaz Public Notary" }] },
    twitter: { card: "summary_large_image", title: "Marwaaz Public Notary", description: "Adeegyo nootaayo oo lagu kalsoonaan karo — Baydhabo, Soomaaliya", images: [`${origin}/og.png`] },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="so" suppressHydrationWarning><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
