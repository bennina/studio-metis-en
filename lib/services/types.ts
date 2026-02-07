// lib/services/types.ts
// Schema e tipi per il sistema servizi dinamico

export interface ServicePreview {
  /** Titolo per la card del servizio */
  title: string;
  /** Sottotitolo breve */
  subtitle?: string;
  /** Descrizione per la card (max 2-3 righe) */
  description: string;
  /** Immagine per la card */
  image?: {
    src: string;
    alt: string;
  };
}

export interface ServiceCategory {
  /** Slug univoco della categoria (es: "fondamenta", "acquisizione") */
  slug: string;
  /** Nome visualizzato */
  name: string;
  /** Ordine di visualizzazione */
  order?: number;
}

export interface Service {
  /** Slug univoco del servizio */
  slug: string;
  /** Categoria del servizio (eyebrow) */
  category: string;
  /** Titolo principale */
  title: string;
  /** Titolo breve per navigazione */
  shortTitle?: string;
  /** Descrizione breve (per liste) */
  excerpt: string;
  /** Icona (opzionale, nome icona Lucide) */
  icon?: string;
  /** Immagine principale */
  featuredImage?: {
    src: string;
    alt: string;
  };
  /** Preview per cards */
  preview: ServicePreview;
  /** Sezione "Quando serve" */
  whenNeeded?: {
    title: string;
    description: string;
  };
  /** Sezione "Cosa ottieni" */
  whatYouGet?: {
    title: string;
    items: string[];
  };
  /** Servizi correlati (slugs) */
  relatedServices?: string[];
  /** Prezzo indicativo */
  pricing?: {
    label: string;
    value: string;
    note?: string;
  };
  /** CTA principale */
  cta?: {
    label: string;
    href: string;
  };
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

export interface ServiceWithCategory extends Service {
  categoryData: ServiceCategory;
}

export interface ServicesSectionConfig {
  /** Modalità visualizzazione */
  mode: "grid" | "list";
  /** Titolo sezione */
  title?: string;
  /** Sottotitolo */
  subtitle?: string;
  /** Limite numero servizi */
  limit?: number;
  /** Filtra per categoria */
  category?: string;
  /** Escludi servizi specifici */
  exclude?: string[];
  /** Colonne griglia */
  columns?: 2 | 3 | 4;
  /** Mostra "Vedi tutti" */
  showViewAll?: boolean;
  /** URL "Vedi tutti" personalizzato */
  viewAllUrl?: string;
}

export interface ServicesIndexConfig {
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
