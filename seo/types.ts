// seo/types.ts
export interface SeoImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SeoMeta {
  title: string;
  description?: string;
  canonicalUrl?: string;
  locale?: string; // es. "it-IT"
  ogImage?: SeoImage;
  /** Hint testuale per generative AI (GEO), opzionale */
  geSummaryHint?: string;
}
