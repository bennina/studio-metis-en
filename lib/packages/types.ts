// lib/packages/types.ts
// Schema e tipi per il sistema pacchetti dinamico

export interface PackagePreview {
  /** Titolo per la card */
  title: string;
  /** Sottotitolo breve */
  subtitle?: string;
  /** Descrizione per la card */
  description: string;
  /** Immagine per la card */
  image?: {
    src: string;
    alt: string;
  };
}

export interface PackageFeature {
  /** Titolo feature */
  title: string;
  /** Descrizione feature */
  description?: string;
  /** Incluso nel pacchetto */
  included: boolean;
}

export interface PackagePricing {
  /** Label prezzo (es: "a partire da") */
  label: string;
  /** Valore prezzo (es: "€ 2.000") */
  value: string;
  /** Note aggiuntive (es: "+ gestione mensile") */
  note?: string;
  /** Prezzo originale per sconti */
  originalValue?: string;
}

export interface Package {
  /** Slug univoco */
  slug: string;
  /** Categoria target (es: "per chi parte da zero") */
  targetAudience: string;
  /** Titolo principale */
  title: string;
  /** Titolo breve per navigazione */
  shortTitle?: string;
  /** Descrizione breve */
  excerpt: string;
  /** Preview per cards */
  preview: PackagePreview;
  /** Icona (opzionale) */
  icon?: string;
  /** Immagine principale */
  featuredImage?: {
    src: string;
    alt: string;
  };
  /** Prezzo */
  pricing: PackagePricing;
  /** Features incluse */
  features?: PackageFeature[];
  /** Cosa include (lista testuale) */
  includes?: string[];
  /** Cosa NON include */
  excludes?: string[];
  /** Risultati attesi */
  outcomes?: string[];
  /** Tempo stimato di realizzazione */
  timeframe?: string;
  /** Servizi inclusi (slugs) */
  includedServices?: string[];
  /** CTA principale */
  cta?: {
    label: string;
    href: string;
  };
  /** Evidenziato/Consigliato */
  highlighted?: boolean;
  /** Badge (es: "Più richiesto") */
  badge?: string;
  /** SEO metadata */
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  /** Stato pubblicazione */
  status?: "published" | "draft";
  /** Ordine nel listing */
  order?: number;
}

export interface PackagesSectionConfig {
  /** Modalità visualizzazione */
  mode: "grid" | "comparison";
  /** Titolo sezione */
  title?: string;
  /** Sottotitolo */
  subtitle?: string;
  /** Limite numero pacchetti */
  limit?: number;
  /** Escludi pacchetti specifici */
  exclude?: string[];
  /** Colonne griglia */
  columns?: 2 | 3 | 4;
  /** Mostra "Vedi tutti" */
  showViewAll?: boolean;
  /** URL "Vedi tutti" personalizzato */
  viewAllUrl?: string;
}

export interface PackagesIndexConfig {
  title: string;
  description?: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}
