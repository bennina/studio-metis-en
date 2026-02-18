// lib/seo/jsonld.ts
// JSON-LD Schema generators for improved SERP

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.metiswebagency.com";

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  email?: string;
  telephone?: string;
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  sameAs?: string[];
  founder?: {
    "@type": "Person";
    name: string;
  };
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "ProfessionalService";
  name: string;
  description: string;
  url: string;
  logo: string;
  image?: string;
  email?: string;
  telephone?: string;
  priceRange?: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  areaServed?: Array<{
    "@type": "State" | "Country";
    name: string;
  }>;
  hasOfferCatalog?: {
    "@type": "OfferCatalog";
    name: string;
    itemListElement: Array<{
      "@type": "Offer";
      itemOffered: {
        "@type": "Service";
        name: string;
        description?: string;
      };
    }>;
  };
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
    url?: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}

export interface ServiceSchema {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
  };
  areaServed?: string;
  serviceType?: string;
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

// Default Organization data
export const getOrganizationSchema = (): OrganizationSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Metis web agency",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "Consulenza digitale, sviluppo siti web ed e-commerce, SEO e campagne Ads per PMI e professionisti.",
  email: "info@metiswebagency.it",
  telephone: "+393494459317",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Menfi",
    addressRegion: "AG",
    postalCode: "92013",
    addressCountry: "IT",
  },
  sameAs: [
    "https://www.linkedin.com/company/metis-web-agency",
    "https://www.instagram.com/metis_webagency",
  ],
  founder: {
    "@type": "Person",
    name: "Elisabetta Monaco",
  },
});

export const getWebSiteSchema = (): WebSiteSchema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Metis web agency",
  url: SITE_URL,
  description: "Consulenza digitale, sviluppo siti web ed e-commerce, SEO e campagne Ads per PMI e professionisti.",
  publisher: {
    "@type": "Organization",
    name: "Metis web agency",
  },
});

export const getLocalBusinessSchema = (): LocalBusinessSchema => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Metis web agency",
  description: "Web agency specializzata in consulenza digitale, sviluppo siti web, e-commerce, SEO e campagne Ads.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-default.jpg`,
  email: "info@metiswebagency.it",
  telephone: "+393494459317",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Menfi",
    addressRegion: "Sicilia",
    addressCountry: "IT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.6056,
    longitude: 12.9702,
  },
  areaServed: [
    { "@type": "State", name: "Sicilia" },
    { "@type": "State", name: "Campania" },
    { "@type": "State", name: "Puglia" },
    { "@type": "State", name: "Lazio" },
    { "@type": "Country", name: "Italia" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servizi Web",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Sviluppo Siti Web",
          description: "Siti web professionali orientati alla conversione",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "E-commerce",
          description: "Negozi online completi con gestione ordini e pagamenti",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SEO & Content Marketing",
          description: "Ottimizzazione per motori di ricerca e contenuti strategici",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Google Ads & Meta Ads",
          description: "Campagne pubblicitarie su Google e social media",
        },
      },
    ],
  },
});

export const getBreadcrumbSchema = (
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.url && index < items.length - 1 ? { item: item.url } : {}),
  })),
});

export const getArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  url: string;
}): ArticleSchema => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  image: article.image.startsWith("http") ? article.image : `${SITE_URL}${article.image}`,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt || article.publishedAt,
  author: {
    "@type": "Person",
    name: article.authorName,
  },
  publisher: {
    "@type": "Organization",
    name: "Metis web agency",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": article.url,
  },
});

export const getServiceSchema = (service: {
  name: string;
  description: string;
  serviceType?: string;
}): ServiceSchema => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  provider: {
    "@type": "Organization",
    name: "Metis web agency",
  },
  areaServed: "Italia",
  serviceType: service.serviceType,
});

export const getFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
): FAQSchema => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Helper to render JSON-LD script tag
export const renderJsonLd = (schema: object): string => {
  return JSON.stringify(schema);
};
