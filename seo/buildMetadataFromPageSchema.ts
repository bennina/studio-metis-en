// seo/buildMetadataFromPageSchema.ts
import type { Metadata } from "next";

type PageSeo = {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  canonicalUrl?: string; // se lo usi nel JSON
  noIndex?: boolean;     // ✅ aggiungi
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.metiswebagency.com/").replace(/\/$/, "");

function abs(urlOrPath: string) {
  try {
    return new URL(urlOrPath).toString();
  } catch {
    return new URL(urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`, siteUrl).toString();
  }
}

export function buildMetadataFromPageSchema(seo?: PageSeo): Metadata {
  const title = seo?.title || "Metis web agency";
  const description = seo?.description || "";

  const canonical = seo?.canonicalUrl || seo?.canonical;
  const canonicalAbs = canonical ? abs(canonical) : undefined;

  const noIndex = !!seo?.noIndex;

  return {
    title,
    description,
    alternates: canonicalAbs ? { canonical: canonicalAbs } : undefined,

    // ✅ QUESTO è il NOINDEX
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
        },

    // (opzionale) OpenGraph ecc...
    // openGraph: {...}
  };
}
