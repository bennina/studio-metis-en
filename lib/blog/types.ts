// lib/blog/types.ts
// Schema e tipi per il sistema blog

/**
 * Preview del post per le card nel loop
 */
export interface PostPreview {
  /** Titolo per la card (può differire dal titolo articolo) */
  title: string;
  /** Sottotitolo breve */
  subtitle?: string;
  /** Descrizione breve per la card */
  description: string;
  /** Immagine per la card */
  image: {
    src: string;
    alt: string;
  };
}

/**
 * Autore del post
 */
export interface PostAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

/**
 * Categoria del blog
 */
export interface BlogCategory {
  /** Slug univoco (usato nell'URL) */
  slug: string;
  /** Nome visualizzato */
  name: string;
  /** Descrizione della categoria */
  description?: string;
  /** Immagine per la card categoria */
  image?: {
    src: string;
    alt: string;
  };
  /** Colore tema (opzionale) */
  color?: string;
  /** Ordine di visualizzazione */
  order?: number;
}

/**
 * Post del blog
 */
export interface BlogPost {
  /** Slug univoco del post */
  slug: string;
  /** Categoria del post (slug) */
  category: string;
  /** Titolo completo dell'articolo */
  title: string;
  /** Excerpt/riassunto per SEO */
  excerpt: string;
  /** Contenuto in formato HTML o Markdown */
  content: string;
  /** Formato del contenuto */
  contentFormat?: "html" | "markdown";
  /** Immagine in evidenza */
  featuredImage: {
    src: string;
    alt: string;
  };
  /** Autore */
  author: PostAuthor;
  /** Data di pubblicazione (ISO string) */
  publishedAt: string;
  /** Data ultima modifica */
  updatedAt?: string;
  /** Preview per le card */
  preview: PostPreview;
  /** Tags aggiuntivi */
  tags?: string[];
  /** SEO custom */
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  /** Post correlati (slugs) */
  relatedPosts?: string[];
  /** Tempo di lettura stimato (minuti) */
  readingTime?: number;
  /** Pubblicato o bozza */
  status?: "published" | "draft";
}

/**
 * Post con categoria popolata
 */
export interface BlogPostWithCategory extends BlogPost {
  categoryData: BlogCategory;
}

/**
 * Configurazione della pagina blog index
 */
export interface BlogIndexConfig {
  /** Titolo della pagina */
  title: string;
  /** Descrizione */
  description: string;
  /** Immagine hero */
  heroImage?: {
    src: string;
    alt: string;
  };
  /** SEO */
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  /** Post in evidenza (slugs) */
  featuredPosts?: string[];
  /** Numero di post per pagina */
  postsPerPage?: number;
}

/**
 * Props per il componente BlogPostsSection
 */
export interface BlogPostsSectionConfig {
  /** Modalità: mostra posts o categorie */
  mode: "posts" | "categories";
  /** Titolo della sezione */
  title?: string;
  /** Sottotitolo */
  subtitle?: string;
  /** Numero massimo di elementi da mostrare (0 = tutti) */
  limit?: number;
  /** Filtra per categoria (solo per mode: posts) */
  category?: string;
  /** Escludi post specifici (slugs) */
  exclude?: string[];
  /** Ordine: recenti prima o più vecchi */
  order?: "newest" | "oldest";
  /** Mostra il link "Vedi tutti" */
  showViewAll?: boolean;
  /** URL personalizzato per "Vedi tutti" */
  viewAllUrl?: string;
  /** Layout delle card */
  columns?: 2 | 3 | 4;
  /** Variante visiva */
  variant?: "default" | "compact" | "featured";
}
