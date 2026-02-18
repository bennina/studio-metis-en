// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getLocalBusinessSchema,
} from "@/lib/seo/jsonld";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.metiswebagency.com")
  .replace(/\/$/, "");

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: "Metis web agency",
  creator: "Elisabetta Monaco",
  publisher: "Metis web agency",

  title: {
    default: "Metis web agency | Consulenza Digitale e Sviluppo Web",
    template: "%s | Metis web agency",
  },

  description:
    "Metis web agency di Elisabetta Monaco: consulenza digitale, sviluppo siti web ed e-commerce, SEO e campagne Ads per PMI e professionisti in Sicilia, Campania, Puglia e Lazio.",

  keywords: [
    "web agency",
    "consulenza digitale",
    "sviluppo siti web",
    "realizzazione siti web",
    "e-commerce",
    "SEO",
    "Google Ads",
    "Meta Ads",
    "Sicilia",
    "Campania",
    "Puglia",
    "Lazio",
    "Menfi",
  ],

  alternates: { canonical: "/" },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  formatDetection: {
    telephone: false,
  },

  // ✅ FAVICON / ICONS (assicurati che i file esistano in /public)
  icons: {
    icon: [
      // prima una favicon “SERP-friendly”
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },

      // classiche
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },

      // fallback ico (meglio multi-size se lo rigeneri)
      { url: "/favicon.ico", type: "image/x-icon" },
    ],

    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  // meglio così:
  manifest: "/site.webmanifest",

  // ✅ OpenGraph default (poi ogni pagina lo sovrascrive con generateMetadata)
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Metis web agency",
    url: SITE_URL,
    title: "Metis web agency | Consulenza Digitale e Sviluppo Web",
    description:
      "Consulenza digitale, siti web ed e-commerce, SEO e Ads per PMI e professionisti in Sicilia, Campania, Puglia e Lazio.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Metis web agency",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Metis web agency | Consulenza Digitale e Sviluppo Web",
    description:
      "Siti web, e-commerce, SEO e Ads per PMI e professionisti in Sicilia, Campania, Puglia e Lazio.",
    images: ["/og-default.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-5MQB66KP"; // metti il tuo vero ID

  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <JsonLd
          data={[
            getOrganizationSchema(),
            getWebSiteSchema(),
            getLocalBusinessSchema(),
          ]}
        />

        {/* IUBENDA widget */}
        <Script
          id="iubenda"
          src="https://embeds.iubenda.com/widgets/fa194046-8776-44f0-b3c4-141a13ce15ce.js"
          strategy="beforeInteractive"
        />
        

        {/* GTM */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      </head>

      <body>
        {/* Skip Link per accessibilità WCAG 2.4.1 - Bypass Blocks */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:shadow-lg focus:font-medium"
        >
          Vai al contenuto principale
        </a>

        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
