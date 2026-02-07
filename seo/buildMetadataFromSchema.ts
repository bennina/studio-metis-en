// seo/buildMetadataFromPageSchema.ts
import type { Metadata } from "next";

type PageSeo = {
  title?: string;
  description?: string;
  ogImage?: string; // es. "/og.jpg" o URL assoluto
  canonical?: string; // es. "/chi-siamo" o URL assoluto
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.metiswebagency.it/")
  .replace(/\/$/, "");

function abs(urlOrPath: string) {
  // accetta già assoluti o relativi
  try {
    return new URL(urlOrPath).toString();
  } catch {
    return new URL(
      urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`,
      siteUrl
    ).toString();
  }
}

export function buildMetadataFromPageSchema(seo?: PageSeo): Metadata {
  const title =
    seo?.title || "Metis web agency | Consulenza Digitale e Sviluppo Web";

  const description =
    seo?.description ||
    "Consulenza digitale e sviluppo web per PMI e professionisti: strategia, siti veloci, SEO e tracciamento (GA4/GTM), contenuti e campagne per portare visibilità e contatti.";

  const canonical = seo?.canonical ? abs(seo.canonical) : `${siteUrl}/`;
  const ogImage = abs(seo?.ogImage || "/og-default.jpg");

  return {
    title,
    description,
    alternates: { canonical },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Metis web agency",
      type: "website",
      locale: "it_IT",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
