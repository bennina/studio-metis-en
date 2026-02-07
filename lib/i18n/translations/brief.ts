// lib/i18n/translations/brief.ts
// Brief Builder translations - IT/EN/FR

import type { Locale, Translations } from '../types';

export const briefTranslations: Record<Locale, Translations> = {
  it: {
    // Steps - must match BRIEF_STEPS ids
    steps: {
      info_cliente: 'Cliente',
      situazione: 'Situazione',
      obiettivi: 'Obiettivi',
      tipologia_sito: 'Tipo Sito',
      infrastruttura: 'Infrastruttura',
      contenuti: 'Contenuti',
      brand: 'Brand',
      funzionalita: 'Funzionalità',
      tracking: 'Tracking',
      post_lancio: 'Post Lancio',
      riepilogo: 'Riepilogo',
    },

    // Step descriptions
    stepDescriptions: {
      info_cliente: 'Dati del cliente e del progetto',
      situazione: 'Cosa ha già il cliente e cosa manca',
      obiettivi: 'Cosa vuole ottenere e quando',
      tipologia_sito: 'Dimensione e complessità del progetto',
      infrastruttura: 'Dominio, hosting, email e sicurezza',
      contenuti: 'Testi, foto, video e contenuti',
      brand: 'Logo, colori, identità visiva',
      funzionalita: 'Funzioni extra e integrazioni',
      tracking: 'Analytics, conversioni e monitoraggio',
      post_lancio: 'Manutenzione e supporto',
      riepilogo: 'Verifica e genera il preventivo',
    },

    // Labels
    labels: {
      companyName: 'Nome azienda / Cliente',
      projectName: 'Nome progetto',
      sector: 'Settore',
      contactName: 'Referente',
      contactEmail: 'Email',
      contactPhone: 'Telefono',
      website: 'Sito attuale',
      notes: 'Note',
      currentSiteUrl: 'URL sito attuale',
      situationNotes: 'Note sulla situazione attuale',
      goalDescription: 'Descrizione obiettivo',
      otherGoal: 'Specifica altro obiettivo',
      targetAudience: 'Target / Pubblico di riferimento',
      competitors: 'Concorrenti',
      internalNotes: 'Note interne (non visibili al cliente)',
      clientNotes: 'Note per il cliente',
      discountPercent: 'Sconto %',
      discountReason: 'Motivazione sconto',
      paymentTerms: 'Condizioni di pagamento',
      estimatedWeeks: 'Settimane stimate',
      validityDays: 'Validità preventivo (giorni)',
    },

    // Placeholders
    placeholders: {
      companyName: 'Es: Rossi Srl',
      projectName: 'Es: Nuovo sito aziendale',
      sector: 'Es: Ristorazione, Moda, Tech...',
      contactName: 'Es: Mario Rossi',
      contactEmail: 'email@azienda.it',
      contactPhone: '+39...',
      website: 'https://...',
      notes: 'Informazioni aggiuntive...',
      goalDescription: 'Descrivi meglio cosa vuole ottenere il cliente...',
      otherGoal: 'Descrivi obiettivo...',
      targetAudience: 'Es: PMI del settore manifatturiero, 25-45 anni...',
      competitors: 'Es: aziendax.it, concorrente.com...',
      internalNotes: 'Note visibili solo internamente...',
      clientNotes: 'Note che appariranno nel preventivo...',
      discountReason: 'Es: Cliente storico, primo progetto...',
      paymentTerms: 'Es: 50% anticipo, 50% consegna',
    },

    // Site status
    siteStatus: {
      title: 'Situazione sito attuale',
      no: 'Non ha un sito',
      rebuild: 'Ha un sito da rifare',
      improve: 'Ha un sito da migliorare',
    },

    // Content status
    contentStatus: {
      title: 'Stato dei contenuti (testi, foto)',
      none: 'Nessun contenuto pronto',
      partial: 'Contenuti parziali',
      complete: 'Contenuti completi',
    },

    // Goals
    goals: {
      title: 'Obiettivo principale',
      leads: 'Generare contatti/lead',
      sales: 'Vendere online',
      presence: 'Presenza e credibilità',
      events: 'Promuovere eventi',
      other: 'Altro',
    },

    // Timeline
    timeline: {
      title: 'Timeline',
      urgent: 'Urgente (< 2 settimane)',
      '1month': 'Entro 1 mese',
      '2months': 'Entro 2 mesi',
      '3months': 'Entro 3 mesi',
      flexible: 'Flessibile',
    },

    // Budget
    budget: {
      title: 'Budget indicativo',
      under2k: 'Fino a €2.000',
      '2k-5k': '€2.000 - €5.000',
      '5k-10k': '€5.000 - €10.000',
      '10k-20k': '€10.000 - €20.000',
      over20k: 'Oltre €20.000',
    },

    // Situation checkboxes
    situation: {
      hasDomain: 'Ha già un dominio',
      hasHosting: 'Ha già un hosting',
      hasEmail: 'Ha email aziendali',
      hasBrandIdentity: 'Ha già brand identity (logo, colori)',
    },

    // Service categories
    categories: {
      tipologia_sito: 'Tipologia Sito',
      infrastruttura: 'Infrastruttura',
      contenuti: 'Contenuti',
      brand: 'Brand Identity',
      funzionalita: 'Funzionalità',
      tracking: 'Tracking & Analytics',
      post_lancio: 'Post Lancio',
    },

    // UI Elements
    ui: {
      next: 'Avanti',
      back: 'Indietro',
      generate: 'Genera Preventivo',
      generating: 'Generazione...',
      total: 'Totale',
      subtotal: 'Subtotale una tantum',
      oneTime: 'Una tantum',
      recurring: '* Costi ricorrenti',
      why: 'Perché serve',
      benefits: 'Vantaggi',
      quantity: 'Quantità',
      showDetails: 'Mostra dettagli',
      selectSiteType: 'Seleziona il tipo di sito più adatto alle esigenze del cliente.',
      clickInfo: 'Clicca sull\'icona info per vedere i dettagli.',
      summaryTitle: 'Riepilogo Preventivo',
      validity: 'Validità preventivo',
      days: 'giorni',
      discount: 'Sconto',
    },

    // PDF
    pdf: {
      title: 'Preventivo',
      date: 'Data',
      validUntil: 'Valido fino al',
      clientInfo: 'Informazioni Cliente',
      projectSummary: 'Riepilogo Progetto',
      totalInvestment: 'Investimento Totale',
      recurringCosts: 'Costi Ricorrenti',
      notes: 'Note',
      footer: 'Documento generato automaticamente',
    },

    // Header
    header: {
      title: 'Brief Builder',
      subtitle: 'Configura il preventivo per il cliente',
    },
  },

  en: {
    // Steps - must match BRIEF_STEPS ids
    steps: {
      info_cliente: 'Client',
      situazione: 'Situation',
      obiettivi: 'Goals',
      tipologia_sito: 'Site Type',
      infrastruttura: 'Infrastructure',
      contenuti: 'Content',
      brand: 'Brand',
      funzionalita: 'Features',
      tracking: 'Tracking',
      post_lancio: 'Post Launch',
      riepilogo: 'Summary',
    },

    // Step descriptions
    stepDescriptions: {
      info_cliente: 'Client and project details',
      situazione: 'What the client already has',
      obiettivi: 'Goals and timeline',
      tipologia_sito: 'Project size and complexity',
      infrastruttura: 'Domain, hosting, email and security',
      contenuti: 'Texts, photos, videos and content',
      brand: 'Logo, colors, visual identity',
      funzionalita: 'Extra features and integrations',
      tracking: 'Analytics, conversions and monitoring',
      post_lancio: 'Maintenance and support',
      riepilogo: 'Review and generate quote',
    },

    // Labels
    labels: {
      companyName: 'Company / Client Name',
      projectName: 'Project name',
      sector: 'Industry',
      contactName: 'Contact Person',
      contactEmail: 'Email',
      contactPhone: 'Phone',
      website: 'Current Website',
      notes: 'Notes',
      currentSiteUrl: 'Current website URL',
      situationNotes: 'Notes about current situation',
      goalDescription: 'Goal description',
      otherGoal: 'Specify other goal',
      targetAudience: 'Target audience',
      competitors: 'Competitors',
      internalNotes: 'Internal notes (not visible to client)',
      clientNotes: 'Notes for client',
      discountPercent: 'Discount %',
      discountReason: 'Discount reason',
      paymentTerms: 'Payment terms',
      estimatedWeeks: 'Estimated weeks',
      validityDays: 'Quote validity (days)',
    },

    // Placeholders
    placeholders: {
      companyName: 'e.g.: Acme Inc.',
      projectName: 'e.g.: New company website',
      sector: 'e.g.: Restaurant, Fashion, Tech...',
      contactName: 'e.g.: John Smith',
      contactEmail: 'email@company.com',
      contactPhone: '+1...',
      website: 'https://...',
      notes: 'Additional information...',
      goalDescription: 'Describe what the client wants to achieve...',
      otherGoal: 'Describe goal...',
      targetAudience: 'e.g.: SMBs in manufacturing, ages 25-45...',
      competitors: 'e.g.: companyx.com, competitor.com...',
      internalNotes: 'Notes visible internally only...',
      clientNotes: 'Notes that will appear in the quote...',
      discountReason: 'e.g.: Long-term client, first project...',
      paymentTerms: 'e.g.: 50% upfront, 50% on delivery',
    },

    // Site status
    siteStatus: {
      title: 'Current website situation',
      no: 'No website',
      rebuild: 'Website needs rebuild',
      improve: 'Website needs improvement',
    },

    // Content status
    contentStatus: {
      title: 'Content status (texts, photos)',
      none: 'No content ready',
      partial: 'Partial content',
      complete: 'Complete content',
    },

    // Goals
    goals: {
      title: 'Main objective',
      leads: 'Generate leads/contacts',
      sales: 'Sell online',
      presence: 'Presence and credibility',
      events: 'Promote events',
      other: 'Other',
    },

    // Timeline
    timeline: {
      title: 'Timeline',
      urgent: 'Urgent (< 2 weeks)',
      '1month': 'Within 1 month',
      '2months': 'Within 2 months',
      '3months': 'Within 3 months',
      flexible: 'Flexible',
    },

    // Budget
    budget: {
      title: 'Estimated budget',
      under2k: 'Up to €2,000',
      '2k-5k': '€2,000 - €5,000',
      '5k-10k': '€5,000 - €10,000',
      '10k-20k': '€10,000 - €20,000',
      over20k: 'Over €20,000',
    },

    // Situation checkboxes
    situation: {
      hasDomain: 'Already has a domain',
      hasHosting: 'Already has hosting',
      hasEmail: 'Has business email',
      hasBrandIdentity: 'Already has brand identity (logo, colors)',
    },

    // Service categories
    categories: {
      tipologia_sito: 'Website Type',
      infrastruttura: 'Infrastructure',
      contenuti: 'Content',
      brand: 'Brand Identity',
      funzionalita: 'Features',
      tracking: 'Tracking & Analytics',
      post_lancio: 'Post Launch',
    },

    // UI Elements
    ui: {
      next: 'Next',
      back: 'Back',
      generate: 'Generate Quote',
      generating: 'Generating...',
      total: 'Total',
      subtotal: 'One-time subtotal',
      oneTime: 'One-time',
      recurring: '* Recurring costs',
      why: 'Why you need it',
      benefits: 'Benefits',
      quantity: 'Quantity',
      showDetails: 'Show details',
      selectSiteType: 'Select the website type that best fits the client\'s needs.',
      clickInfo: 'Click the info icon to see details.',
      summaryTitle: 'Quote Summary',
      validity: 'Quote validity',
      days: 'days',
      discount: 'Discount',
    },

    // PDF
    pdf: {
      title: 'Quote',
      date: 'Date',
      validUntil: 'Valid until',
      clientInfo: 'Client Information',
      projectSummary: 'Project Summary',
      totalInvestment: 'Total Investment',
      recurringCosts: 'Recurring Costs',
      notes: 'Notes',
      footer: 'Automatically generated document',
    },

    // Header
    header: {
      title: 'Brief Builder',
      subtitle: 'Configure the quote for the client',
    },
  },

  fr: {
    // Steps - must match BRIEF_STEPS ids
    steps: {
      info_cliente: 'Client',
      situazione: 'Situation',
      obiettivi: 'Objectifs',
      tipologia_sito: 'Type Site',
      infrastruttura: 'Infrastructure',
      contenuti: 'Contenus',
      brand: 'Marque',
      funzionalita: 'Fonctions',
      tracking: 'Tracking',
      post_lancio: 'Post Lancement',
      riepilogo: 'Résumé',
    },

    // Step descriptions
    stepDescriptions: {
      info_cliente: 'Données du client et du projet',
      situazione: 'Ce que le client a déjà',
      obiettivi: 'Objectifs et délais',
      tipologia_sito: 'Taille et complexité du projet',
      infrastruttura: 'Domaine, hébergement, email et sécurité',
      contenuti: 'Textes, photos, vidéos et contenus',
      brand: 'Logo, couleurs, identité visuelle',
      funzionalita: 'Fonctionnalités supplémentaires et intégrations',
      tracking: 'Analytics, conversions et suivi',
      post_lancio: 'Maintenance et support',
      riepilogo: 'Vérifier et générer le devis',
    },

    // Labels
    labels: {
      companyName: 'Nom entreprise / Client',
      projectName: 'Nom du projet',
      sector: 'Secteur',
      contactName: 'Contact',
      contactEmail: 'Email',
      contactPhone: 'Téléphone',
      website: 'Site actuel',
      notes: 'Notes',
      currentSiteUrl: 'URL du site actuel',
      situationNotes: 'Notes sur la situation actuelle',
      goalDescription: 'Description de l\'objectif',
      otherGoal: 'Préciser autre objectif',
      targetAudience: 'Public cible',
      competitors: 'Concurrents',
      internalNotes: 'Notes internes (non visibles au client)',
      clientNotes: 'Notes pour le client',
      discountPercent: 'Remise %',
      discountReason: 'Motif de la remise',
      paymentTerms: 'Conditions de paiement',
      estimatedWeeks: 'Semaines estimées',
      validityDays: 'Validité du devis (jours)',
    },

    // Placeholders
    placeholders: {
      companyName: 'Ex: Dupont SARL',
      projectName: 'Ex: Nouveau site entreprise',
      sector: 'Ex: Restauration, Mode, Tech...',
      contactName: 'Ex: Jean Dupont',
      contactEmail: 'email@entreprise.fr',
      contactPhone: '+33...',
      website: 'https://...',
      notes: 'Informations supplémentaires...',
      goalDescription: 'Décrivez mieux ce que le client veut atteindre...',
      otherGoal: 'Décrivez l\'objectif...',
      targetAudience: 'Ex: PME du secteur manufacturier, 25-45 ans...',
      competitors: 'Ex: entreprisex.fr, concurrent.com...',
      internalNotes: 'Notes visibles uniquement en interne...',
      clientNotes: 'Notes qui apparaîtront dans le devis...',
      discountReason: 'Ex: Client fidèle, premier projet...',
      paymentTerms: 'Ex: 50% acompte, 50% livraison',
    },

    // Site status
    siteStatus: {
      title: 'Situation du site actuel',
      no: 'Pas de site',
      rebuild: 'Site à refaire',
      improve: 'Site à améliorer',
    },

    // Content status
    contentStatus: {
      title: 'État des contenus (textes, photos)',
      none: 'Aucun contenu prêt',
      partial: 'Contenus partiels',
      complete: 'Contenus complets',
    },

    // Goals
    goals: {
      title: 'Objectif principal',
      leads: 'Générer des contacts/leads',
      sales: 'Vendre en ligne',
      presence: 'Présence et crédibilité',
      events: 'Promouvoir des événements',
      other: 'Autre',
    },

    // Timeline
    timeline: {
      title: 'Délai',
      urgent: 'Urgent (< 2 semaines)',
      '1month': 'Sous 1 mois',
      '2months': 'Sous 2 mois',
      '3months': 'Sous 3 mois',
      flexible: 'Flexible',
    },

    // Budget
    budget: {
      title: 'Budget indicatif',
      under2k: 'Jusqu\'à 2 000€',
      '2k-5k': '2 000€ - 5 000€',
      '5k-10k': '5 000€ - 10 000€',
      '10k-20k': '10 000€ - 20 000€',
      over20k: 'Plus de 20 000€',
    },

    // Situation checkboxes
    situation: {
      hasDomain: 'A déjà un domaine',
      hasHosting: 'A déjà un hébergement',
      hasEmail: 'A des emails professionnels',
      hasBrandIdentity: 'A déjà une identité de marque (logo, couleurs)',
    },

    // Service categories
    categories: {
      tipologia_sito: 'Type de Site',
      infrastruttura: 'Infrastructure',
      contenuti: 'Contenus',
      brand: 'Identité de Marque',
      funzionalita: 'Fonctionnalités',
      tracking: 'Tracking & Analytics',
      post_lancio: 'Post Lancement',
    },

    // UI Elements
    ui: {
      next: 'Suivant',
      back: 'Retour',
      generate: 'Générer le Devis',
      generating: 'Génération...',
      total: 'Total',
      subtotal: 'Sous-total paiement unique',
      oneTime: 'Paiement unique',
      recurring: '* Coûts récurrents',
      why: 'Pourquoi c\'est nécessaire',
      benefits: 'Avantages',
      quantity: 'Quantité',
      showDetails: 'Afficher les détails',
      selectSiteType: 'Sélectionnez le type de site le plus adapté aux besoins du client.',
      clickInfo: 'Cliquez sur l\'icône info pour voir les détails.',
      summaryTitle: 'Résumé du Devis',
      validity: 'Validité du devis',
      days: 'jours',
      discount: 'Remise',
    },

    // PDF
    pdf: {
      title: 'Devis',
      date: 'Date',
      validUntil: 'Valable jusqu\'au',
      clientInfo: 'Informations Client',
      projectSummary: 'Résumé du Projet',
      totalInvestment: 'Investissement Total',
      recurringCosts: 'Coûts Récurrents',
      notes: 'Notes',
      footer: 'Document généré automatiquement',
    },

    // Header
    header: {
      title: 'Brief Builder',
      subtitle: 'Configurez le devis pour le client',
    },
  },
};

// Service translations for pricing data
export const serviceTranslations: Record<Locale, Record<string, { name: string; description: string; whyNeeded: string; benefits: string[] }>> = {
  it: {
    // Site types
    landing_page: {
      name: 'Landing Page',
      description: 'Pagina singola ottimizzata per conversioni',
      whyNeeded: 'Ideale per campagne pubblicitarie, lanci prodotto o lead generation focalizzata su un singolo obiettivo.',
      benefits: ['Alta conversione', 'Veloce da realizzare', 'Perfetta per ads', 'A/B testing facile'],
    },
    sito_vetrina: {
      name: 'Sito Vetrina',
      description: 'Sito multi-pagina per presentare l\'azienda',
      whyNeeded: 'Presenta l\'azienda in modo professionale, costruisce credibilità e fornisce tutte le informazioni ai potenziali clienti.',
      benefits: ['Presenza professionale', 'Credibilità', 'SEO organico', 'Informazioni complete'],
    },
    ecommerce: {
      name: 'E-commerce',
      description: 'Negozio online completo con gestione prodotti',
      whyNeeded: 'Per vendere prodotti online 24/7, raggiungere clienti ovunque e automatizzare il processo di vendita.',
      benefits: ['Vendite 24/7', 'Scalabilità', 'Pagamenti automatici', 'Gestione magazzino'],
    },
    // Infrastructure
    hosting_base: {
      name: 'Hosting Base',
      description: 'Server condiviso per siti di piccole dimensioni',
      whyNeeded: 'Il sito ha bisogno di uno spazio web per essere online. L\'hosting base è ideale per siti con traffico contenuto.',
      benefits: ['Economico', 'Gestione inclusa', 'Backup automatici', 'Supporto tecnico'],
    },
    dominio: {
      name: 'Registrazione Dominio',
      description: 'Il tuo indirizzo web personalizzato',
      whyNeeded: 'L\'indirizzo web è l\'identità online dell\'azienda. Un dominio proprio comunica professionalità.',
      benefits: ['Identità unica', 'Professionalità', 'Email personalizzate', 'Controllo totale'],
    },
  },
  en: {
    landing_page: {
      name: 'Landing Page',
      description: 'Single page optimized for conversions',
      whyNeeded: 'Ideal for advertising campaigns, product launches or lead generation focused on a single goal.',
      benefits: ['High conversion', 'Quick to build', 'Perfect for ads', 'Easy A/B testing'],
    },
    sito_vetrina: {
      name: 'Showcase Website',
      description: 'Multi-page site to present the company',
      whyNeeded: 'Presents the company professionally, builds credibility and provides all information to potential customers.',
      benefits: ['Professional presence', 'Credibility', 'Organic SEO', 'Complete information'],
    },
    ecommerce: {
      name: 'E-commerce',
      description: 'Complete online store with product management',
      whyNeeded: 'To sell products online 24/7, reach customers anywhere and automate the sales process.',
      benefits: ['24/7 sales', 'Scalability', 'Automatic payments', 'Inventory management'],
    },
    hosting_base: {
      name: 'Basic Hosting',
      description: 'Shared server for small websites',
      whyNeeded: 'The website needs web space to be online. Basic hosting is ideal for low-traffic sites.',
      benefits: ['Affordable', 'Managed service', 'Automatic backups', 'Technical support'],
    },
    dominio: {
      name: 'Domain Registration',
      description: 'Your custom web address',
      whyNeeded: 'The web address is the company\'s online identity. A custom domain communicates professionalism.',
      benefits: ['Unique identity', 'Professionalism', 'Custom emails', 'Total control'],
    },
  },
  fr: {
    landing_page: {
      name: 'Page d\'atterrissage',
      description: 'Page unique optimisée pour les conversions',
      whyNeeded: 'Idéale pour les campagnes publicitaires, lancements de produits ou génération de leads focalisée sur un seul objectif.',
      benefits: ['Haute conversion', 'Rapide à réaliser', 'Parfaite pour les pubs', 'Tests A/B faciles'],
    },
    sito_vetrina: {
      name: 'Site Vitrine',
      description: 'Site multi-pages pour présenter l\'entreprise',
      whyNeeded: 'Présente l\'entreprise de manière professionnelle, construit la crédibilité et fournit toutes les informations aux clients potentiels.',
      benefits: ['Présence professionnelle', 'Crédibilité', 'SEO organique', 'Informations complètes'],
    },
    ecommerce: {
      name: 'E-commerce',
      description: 'Boutique en ligne complète avec gestion des produits',
      whyNeeded: 'Pour vendre des produits en ligne 24h/24, atteindre des clients partout et automatiser le processus de vente.',
      benefits: ['Ventes 24/7', 'Évolutivité', 'Paiements automatiques', 'Gestion des stocks'],
    },
    hosting_base: {
      name: 'Hébergement de Base',
      description: 'Serveur partagé pour petits sites',
      whyNeeded: 'Le site a besoin d\'un espace web pour être en ligne. L\'hébergement de base est idéal pour les sites à faible trafic.',
      benefits: ['Économique', 'Gestion incluse', 'Sauvegardes automatiques', 'Support technique'],
    },
    dominio: {
      name: 'Enregistrement de Domaine',
      description: 'Votre adresse web personnalisée',
      whyNeeded: 'L\'adresse web est l\'identité en ligne de l\'entreprise. Un domaine propre communique le professionnalisme.',
      benefits: ['Identité unique', 'Professionnalisme', 'Emails personnalisés', 'Contrôle total'],
    },
  },
};
