// lib/brief/pricingData.ts

/**
 * Listino prezzi e descrizioni servizi per il Brief Builder
 * Uso interno: Agenzia / Partner / Commerciali
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  whyNeeded: string;
  benefits: string[];
  price: number;
  priceUnit: 'una_tantum' | 'mensile' | 'annuale' | 'trimestrale' | 'a_pagina' | 'a_ora';
  category: ServiceCategory;
  required?: boolean;
  dependsOn?: string[];
  includedIn?: string[];
}

export type ServiceCategory =
  | 'tipologia_sito'
  | 'infrastruttura'
  | 'contenuti'
  | 'brand'
  | 'funzionalita'
  | 'tracking'
  | 'post_lancio';

export interface BriefStep {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory | 'info_cliente' | 'situazione' | 'obiettivi' | 'riepilogo';
}

// ─────────────────────────────────────────────────────────────────────────────
// STEPS DEL BRIEF
// ─────────────────────────────────────────────────────────────────────────────

export const BRIEF_STEPS: BriefStep[] = [
  {
    id: 'info_cliente',
    title: 'Informazioni Cliente',
    description: 'Dati del cliente e del progetto',
    category: 'info_cliente',
  },
  {
    id: 'situazione',
    title: 'Situazione Attuale',
    description: 'Cosa ha già il cliente e cosa manca',
    category: 'situazione',
  },
  {
    id: 'obiettivi',
    title: 'Obiettivi e Timeline',
    description: 'Cosa vuole ottenere e quando',
    category: 'obiettivi',
  },
  {
    id: 'tipologia_sito',
    title: 'Tipologia Sito',
    description: 'Dimensione e complessità del progetto',
    category: 'tipologia_sito',
  },
  {
    id: 'infrastruttura',
    title: 'Infrastruttura',
    description: 'Dominio, hosting, email e sicurezza',
    category: 'infrastruttura',
  },
  {
    id: 'contenuti',
    title: 'Contenuti',
    description: 'Testi, immagini e materiali',
    category: 'contenuti',
  },
  {
    id: 'brand',
    title: 'Brand & Identity',
    description: 'Logo, colori, identità visiva',
    category: 'brand',
  },
  {
    id: 'funzionalita',
    title: 'Funzionalità Extra',
    description: 'Moduli e integrazioni speciali',
    category: 'funzionalita',
  },
  {
    id: 'tracking',
    title: 'Tracking & Analytics',
    description: 'Misurazione e reportistica',
    category: 'tracking',
  },
  {
    id: 'post_lancio',
    title: 'Post-Lancio',
    description: 'Manutenzione, assistenza e crescita',
    category: 'post_lancio',
  },
  {
    id: 'riepilogo',
    title: 'Riepilogo Preventivo',
    description: 'Dettaglio costi e timeline',
    category: 'riepilogo',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LISTINO SERVIZI
// ─────────────────────────────────────────────────────────────────────────────

export const SERVICES: ServiceItem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TIPOLOGIA SITO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'sito_onepage',
    name: 'One Page',
    description: 'Sito a pagina singola, ideale per landing o presenza minima',
    whyNeeded: 'Perfetto per chi parte da zero, per campagne specifiche o per validare un\'idea prima di investire di più.',
    benefits: [
      'Costo contenuto per partire subito',
      'Messaggio chiaro e focalizzato',
      'Ottimo per campagne Ads',
      'Tempi di realizzazione rapidi (2-3 settimane)',
    ],
    price: 800,
    priceUnit: 'una_tantum',
    category: 'tipologia_sito',
  },
  {
    id: 'sito_corporate',
    name: 'Sito Corporate (5-7 pagine)',
    description: 'Sito aziendale completo con pagine servizi, chi siamo, contatti',
    whyNeeded: 'La base per qualsiasi azienda che vuole essere trovata online e trasmettere professionalità.',
    benefits: [
      'Presenza professionale completa',
      'SEO su più pagine = più visibilità',
      'Spazio per raccontare servizi e valori',
      'Base solida per future espansioni',
    ],
    price: 1200,
    priceUnit: 'una_tantum',
    category: 'tipologia_sito',
  },
  {
    id: 'sito_professionale',
    name: 'Sito Professionale (8-15 pagine)',
    description: 'Sito strutturato con sezioni dedicate, blog, portfolio o case study',
    whyNeeded: 'Per aziende con più servizi, studi professionali, o chi vuole posizionarsi come riferimento nel settore.',
    benefits: [
      'Architettura SEO avanzata',
      'Spazio per contenuti che convertono',
      'Portfolio/case study per credibilità',
      'Blog per traffico organico',
    ],
    price: 3000,
    priceUnit: 'una_tantum',
    category: 'tipologia_sito',
  },
  {
    id: 'sito_portale',
    name: 'Portale (15+ pagine)',
    description: 'Sito complesso con molte sezioni, multilingua, aree riservate',
    whyNeeded: 'Per realtà strutturate con esigenze complesse: multi-sede, multi-servizio, contenuti articolati.',
    benefits: [
      'Gestione contenuti avanzata',
      'Scalabilità nel tempo',
      'Aree riservate e funzionalità custom',
      'Architettura enterprise-grade',
    ],
    price: 8000,
    priceUnit: 'una_tantum',
    category: 'tipologia_sito',
  },
  {
    id: 'ecommerce_base',
    name: 'E-commerce Base (fino a 50 prodotti)',
    description: 'Negozio online con catalogo, carrello, checkout e pagamenti',
    whyNeeded: 'Per iniziare a vendere online con una struttura professionale e scalabile.',
    benefits: [
      'Vendita 24/7 senza limiti geografici',
      'Pagamenti sicuri integrati',
      'Gestione ordini e magazzino',
      'Base per crescita futura',
    ],
    price: 8000,
    priceUnit: 'una_tantum',
    category: 'tipologia_sito',
  },
  {
    id: 'ecommerce_avanzato',
    name: 'E-commerce Avanzato (50+ prodotti)',
    description: 'E-commerce strutturato con filtri, varianti, promozioni, integrazioni',
    whyNeeded: 'Per chi ha un catalogo ampio e vuole un\'esperienza d\'acquisto ottimizzata.',
    benefits: [
      'UX ottimizzata per conversione',
      'Filtri e ricerca avanzata',
      'Sistema promozioni e sconti',
      'Integrazioni gestionali/magazzino',
    ],
    price: 12000,
    priceUnit: 'una_tantum',
    category: 'tipologia_sito',
  },
  {
    id: 'restyling',
    name: 'Restyling Sito Esistente',
    description: 'Rifacimento grafico e strutturale mantenendo contenuti esistenti',
    whyNeeded: 'Quando il sito c\'è ma è datato, lento, o non converte più come prima.',
    benefits: [
      'Preserva il posizionamento SEO acquisito',
      'Aggiorna l\'immagine senza ripartire da zero',
      'Migliora performance e conversioni',
      'Costi inferiori rispetto a un sito nuovo',
    ],
    price: 1200,
    priceUnit: 'una_tantum',
    category: 'tipologia_sito',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INFRASTRUTTURA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'dominio',
    name: 'Registrazione Dominio',
    description: 'Registrazione e gestione del nome a dominio (es. tuaazienda.it)',
    whyNeeded: 'Il dominio è l\'indirizzo del tuo sito. Senza dominio, non esisti online.',
    benefits: [
      'Identità professionale online',
      'Email con il tuo dominio (@tuaazienda.it)',
      'Credibilità e riconoscibilità',
      'Protezione del brand',
    ],
    price: 10,
    priceUnit: 'annuale',
    category: 'infrastruttura',
  },
  {
    id: 'hosting_base',
    name: 'Hosting Condiviso',
    description: 'Spazio web su server condiviso, adatto a siti vetrina',
    whyNeeded: 'Il sito deve "abitare" da qualche parte. L\'hosting determina velocità e affidabilità.',
    benefits: [
      'Costo contenuto',
      'Sufficiente per siti con traffico medio',
      'Backup inclusi',
      'Supporto tecnico',
    ],
    price: 100,
    priceUnit: 'annuale',
    category: 'infrastruttura',
  },
  {
    id: 'hosting_performance',
    name: 'Hosting Performance / VPS',
    description: 'Server dedicato o VPS per siti ad alto traffico o e-commerce',
    whyNeeded: 'Per siti che devono essere sempre veloci, anche sotto carico (e-commerce, portali).',
    benefits: [
      'Velocità superiore (Core Web Vitals)',
      'Risorse garantite e scalabili',
      'Migliore posizionamento SEO',
      'Uptime garantito 99.9%',
    ],
    price: 500,
    priceUnit: 'annuale',
    category: 'infrastruttura',
  },
  {
    id: 'email_pro',
    name: 'Email Professionale (5 caselle)',
    description: 'Caselle email con il tuo dominio (nome@tuaazienda.it)',
    whyNeeded: 'Le email @gmail.com non ispirano fiducia. L\'email professionale è un must.',
    benefits: [
      'Professionalità nelle comunicazioni',
      'Migliore deliverability (meno spam)',
      'Gestione centralizzata',
      'Spazio e funzionalità business',
    ],
    price: 50,
    priceUnit: 'annuale',
    category: 'infrastruttura',
  },
  {
    id: 'ssl',
    name: 'Certificato SSL',
    description: 'Crittografia HTTPS per connessioni sicure',
    whyNeeded: 'Google penalizza i siti senza HTTPS. I browser mostrano "Non sicuro".',
    benefits: [
      'Sicurezza dati utenti',
      'Requisito SEO (Google lo richiede)',
      'Icona lucchetto = fiducia',
      'Obbligatorio per pagamenti online',
    ],
    price: 50,
    priceUnit: 'annuale',
    category: 'infrastruttura',
    includedIn: ['hosting_base', 'hosting_performance'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENUTI
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'copywriting',
    name: 'Copywriting Pagine',
    description: 'Scrittura professionale dei testi per ogni pagina del sito',
    whyNeeded: 'I testi fanno la differenza tra un visitatore che se ne va e uno che contatta.',
    benefits: [
      'Messaggi chiari e persuasivi',
      'Ottimizzazione SEO integrata',
      'Tone of voice coerente',
      'CTA efficaci',
    ],
    price: 85,
    priceUnit: 'a_pagina',
    category: 'contenuti',
  },
  {
    id: 'revisione_testi',
    name: 'Revisione Testi Esistenti',
    description: 'Editing e ottimizzazione di contenuti già scritti dal cliente',
    whyNeeded: 'Quando il cliente ha già dei testi ma non sono ottimizzati per il web.',
    benefits: [
      'Risparmio rispetto a riscrittura completa',
      'Mantiene la voce del cliente',
      'Ottimizzazione SEO',
      'Migliora leggibilità e conversione',
    ],
    price: 50,
    priceUnit: 'a_pagina',
    category: 'contenuti',
  },
  {
    id: 'shooting',
    name: 'Shooting Fotografico',
    description: 'Servizio fotografico professionale (mezza giornata)',
    whyNeeded: 'Le foto stock si riconoscono. Foto reali = autenticità e fiducia.',
    benefits: [
      'Immagini uniche e autentiche',
      'Coerenza visiva con il brand',
      'Utilizzo illimitato',
      'Differenziazione dalla concorrenza',
    ],
    price: 1000,
    priceUnit: 'una_tantum',
    category: 'contenuti',
  },
  {
    id: 'foto_stock',
    name: 'Selezione Foto Stock Premium',
    description: 'Ricerca e acquisto di immagini stock di qualità',
    whyNeeded: 'Alternativa economica allo shooting quando le foto proprie non sono disponibili.',
    benefits: [
      'Costo inferiore allo shooting',
      'Disponibilità immediata',
      'Alta qualità garantita',
      'Licenza commerciale inclusa',
    ],
    price: 300,
    priceUnit: 'una_tantum',
    category: 'contenuti',
  },
  {
    id: 'video_base',
    name: 'Video Presentazione Base',
    description: 'Video aziendale breve (30-60 sec) con riprese e montaggio',
    whyNeeded: 'I video aumentano il tempo di permanenza e le conversioni.',
    benefits: [
      'Engagement superiore alle immagini',
      'Racconta la storia in modo coinvolgente',
      'Utilizzabile su sito e social',
      'Migliora SEO (tempo sulla pagina)',
    ],
    price: 2000,
    priceUnit: 'una_tantum',
    category: 'contenuti',
  },
  {
    id: 'traduzione',
    name: 'Traduzione Professionale',
    description: 'Traduzione dei contenuti in altre lingue (per pagina)',
    whyNeeded: 'Per raggiungere mercati internazionali o clienti che parlano altre lingue.',
    benefits: [
      'Nuovi mercati accessibili',
      'SEO multilingua',
      'Traduzione professionale (non automatica)',
      'Localizzazione culturale',
    ],
    price: 100,
    priceUnit: 'a_pagina',
    category: 'contenuti',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BRAND & IDENTITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mini_brand_kit',
    name: 'Mini Brand Kit',
    description: 'Palette colori, tipografia, regole base di utilizzo',
    whyNeeded: 'Per avere coerenza visiva su tutti i materiali, anche senza un rebranding completo.',
    benefits: [
      'Coerenza su web, social, stampa',
      'Guida per fornitori esterni',
      'Professionalità percepita',
      'Base per future evoluzioni',
    ],
    price: 1000,
    priceUnit: 'una_tantum',
    category: 'brand',
  },
  {
    id: 'logo_design',
    name: 'Logo Design',
    description: 'Progettazione logo professionale con varianti e formati',
    whyNeeded: 'Il logo è il primo elemento di riconoscimento. Deve essere professionale.',
    benefits: [
      'Identità visiva distintiva',
      'Versatilità (web, stampa, social)',
      'File in tutti i formati necessari',
      'Manuale d\'uso incluso',
    ],
    price: 2000,
    priceUnit: 'una_tantum',
    category: 'brand',
  },
  {
    id: 'brand_identity',
    name: 'Brand Identity Completa',
    description: 'Logo, palette, tipografia, tone of voice, linee guida complete',
    whyNeeded: 'Per aziende che vogliono un\'identità forte e coerente su tutti i touchpoint.',
    benefits: [
      'Posizionamento chiaro nel mercato',
      'Differenziazione dalla concorrenza',
      'Coerenza su ogni canale',
      'Asset per anni di comunicazione',
    ],
    price: 4000,
    priceUnit: 'una_tantum',
    category: 'brand',
  },
  {
    id: 'social_kit',
    name: 'Kit Template Social',
    description: 'Template grafici per post, storie, copertine social',
    whyNeeded: 'Per mantenere coerenza visiva sui social senza dipendere sempre da un grafico.',
    benefits: [
      'Autonomia nella creazione contenuti',
      'Coerenza con il brand',
      'Risparmio tempo e costi',
      'Formati per ogni piattaforma',
    ],
    price: 800,
    priceUnit: 'una_tantum',
    category: 'brand',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FUNZIONALITÀ EXTRA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'form_avanzati',
    name: 'Form Avanzati / Multi-step',
    description: 'Form complessi con logica condizionale, validazione, upload file',
    whyNeeded: 'Per raccogliere informazioni strutturate e qualificare i lead.',
    benefits: [
      'Lead più qualificati',
      'Riduzione richieste generiche',
      'Automazione pre-vendita',
      'Integrazione con CRM/email',
    ],
    price: 800,
    priceUnit: 'una_tantum',
    category: 'funzionalita',
  },
  {
    id: 'booking',
    name: 'Sistema Prenotazioni',
    description: 'Calendario prenotazioni con disponibilità, reminder, pagamenti',
    whyNeeded: 'Per professioni che lavorano su appuntamento (consulenti, medici, coach...).',
    benefits: [
      'Zero telefonate per fissare appuntamenti',
      'Riduzione no-show con reminder',
      'Pagamento anticipato opzionale',
      'Sincronizzazione calendario',
    ],
    price: 1500,
    priceUnit: 'una_tantum',
    category: 'funzionalita',
  },
  {
    id: 'chat_whatsapp',
    name: 'Integrazione Chat / WhatsApp',
    description: 'Widget chat live o pulsante WhatsApp con tracking',
    whyNeeded: 'Per abbassare la barriera di contatto e rispondere in tempo reale.',
    benefits: [
      'Contatto immediato',
      'Preferito da molti utenti',
      'Tracking delle conversazioni',
      'Automazioni base possibili',
    ],
    price: 300,
    priceUnit: 'una_tantum',
    category: 'funzionalita',
  },
  {
    id: 'crm_integration',
    name: 'Integrazione CRM',
    description: 'Collegamento con HubSpot, Salesforce, Pipedrive o simili',
    whyNeeded: 'Per gestire i lead in modo strutturato e non perdere opportunità.',
    benefits: [
      'Lead automaticamente nel CRM',
      'Storico interazioni cliente',
      'Pipeline vendita tracciata',
      'Automazioni marketing',
    ],
    price: 800,
    priceUnit: 'una_tantum',
    category: 'funzionalita',
  },
  {
    id: 'newsletter',
    name: 'Sistema Newsletter',
    description: 'Setup Mailchimp/Brevo con form iscrizione e automazioni base',
    whyNeeded: 'Per costruire una lista di contatti e comunicare regolarmente.',
    benefits: [
      'Lista contatti di proprietà',
      'Costo acquisizione ridotto nel tempo',
      'Automazioni welcome/nurturing',
      'Misurabilità completa',
    ],
    price: 500,
    priceUnit: 'una_tantum',
    category: 'funzionalita',
  },
  {
    id: 'area_riservata',
    name: 'Area Riservata / Membri',
    description: 'Sezione protetta da login per clienti, partner o dipendenti',
    whyNeeded: 'Per condividere contenuti esclusivi o documenti riservati.',
    benefits: [
      'Contenuti protetti',
      'Fidelizzazione clienti',
      'Distribuzione materiali sicura',
      'Gestione accessi centralizzata',
    ],
    price: 1500,
    priceUnit: 'una_tantum',
    category: 'funzionalita',
  },
  {
    id: 'multilingua',
    name: 'Gestione Multilingua',
    description: 'Struttura sito per più lingue con switch e SEO dedicata',
    whyNeeded: 'Per raggiungere mercati internazionali con contenuti localizzati.',
    benefits: [
      'SEO separata per ogni lingua',
      'Esperienza utente nella sua lingua',
      'Gestione contenuti centralizzata',
      'URL e meta ottimizzati per paese',
    ],
    price: 1000,
    priceUnit: 'una_tantum',
    category: 'funzionalita',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRACKING & ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'tracking_base',
    name: 'Setup GA4 + GTM Base',
    description: 'Installazione Google Analytics 4 e Tag Manager con eventi base',
    whyNeeded: 'Senza dati, non sai cosa funziona. Il tracking è la base di ogni decisione.',
    benefits: [
      'Sai quanti visitatori hai',
      'Capisci da dove arrivano',
      'Vedi cosa fanno sul sito',
      'Base per ottimizzazioni future',
    ],
    price: 400,
    priceUnit: 'una_tantum',
    category: 'tracking',
  },
  {
    id: 'tracking_avanzato',
    name: 'Tracking Avanzato + Conversioni',
    description: 'Eventi custom, goal, e-commerce enhanced, funnel completi',
    whyNeeded: 'Per capire davvero il comportamento utenti e ottimizzare le conversioni.',
    benefits: [
      'Tracking ogni azione importante',
      'Funnel di conversione visibili',
      'Dati per campagne Ads ottimizzate',
      'Attribuzione precisa',
    ],
    price: 1000,
    priceUnit: 'una_tantum',
    category: 'tracking',
  },
  {
    id: 'dashboard',
    name: 'Dashboard Personalizzata',
    description: 'Report automatico con KPI chiave in Looker Studio o simili',
    whyNeeded: 'Per avere i dati importanti sempre a portata di mano, senza cercarli.',
    benefits: [
      'KPI a colpo d\'occhio',
      'Aggiornamento automatico',
      'Condivisibile con il team',
      'Decisioni data-driven',
    ],
    price: 800,
    priceUnit: 'una_tantum',
    category: 'tracking',
  },
  {
    id: 'heatmap',
    name: 'Heatmap e Session Recording',
    description: 'Setup Hotjar/Clarity per vedere dove cliccano e come navigano',
    whyNeeded: 'Per capire visivamente i problemi di UX e dove gli utenti si bloccano.',
    benefits: [
      'Vedi esattamente cosa fanno gli utenti',
      'Identifica problemi di UX',
      'Recording per debug',
      'Dati qualitativi oltre ai numeri',
    ],
    price: 400,
    priceUnit: 'una_tantum',
    category: 'tracking',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // POST-LANCIO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'manutenzione_base',
    name: 'Manutenzione Base',
    description: 'Aggiornamenti trimestrali, backup, monitoraggio sicurezza',
    whyNeeded: 'Un sito non aggiornato diventa vulnerabile e lento. Va mantenuto.',
    benefits: [
      'Sicurezza garantita',
      'Performance costanti',
      'Backup in caso di problemi',
      '2 ore interventi incluse',
    ],
    price: 150,
    priceUnit: 'trimestrale',
    category: 'post_lancio',
  },
  {
    id: 'manutenzione_standard',
    name: 'Manutenzione Standard',
    description: 'Aggiornamenti mensili, backup settimanali, 4h interventi incluse',
    whyNeeded: 'Per siti professionali che devono essere sempre al top.',
    benefits: [
      'Controlli più frequenti',
      'Interventi rapidi inclusi',
      'Monitoraggio uptime 24/7',
      'Priorità nelle richieste',
    ],
    price: 120,
    priceUnit: 'mensile',
    category: 'post_lancio',
  },
  {
    id: 'manutenzione_premium',
    name: 'Manutenzione Premium',
    description: 'Controlli settimanali, 8h interventi, supporto prioritario',
    whyNeeded: 'Per e-commerce e portali dove ogni minuto di downtime costa.',
    benefits: [
      'Massima reattività',
      'Ore interventi generose',
      'Supporto prioritario',
      'Report mensile dettagliato',
    ],
    price: 300,
    priceUnit: 'mensile',
    category: 'post_lancio',
  },
  {
    id: 'formazione',
    name: 'Formazione Gestione Sito',
    description: 'Sessione formativa per aggiornare contenuti in autonomia',
    whyNeeded: 'Per essere autonomi nelle modifiche quotidiane senza dipendere da noi.',
    benefits: [
      'Autonomia operativa',
      'Risparmio costi nel tempo',
      'Reattività nelle modifiche',
      'Video registrazione inclusa',
    ],
    price: 300,
    priceUnit: 'una_tantum',
    category: 'post_lancio',
  },
  {
    id: 'assistenza_ore',
    name: 'Pacchetto Ore Assistenza',
    description: 'Ore prepagate per modifiche, aggiunte, supporto',
    whyNeeded: 'Per avere un budget di ore da usare quando serve, a tariffa agevolata.',
    benefits: [
      'Tariffa ridotta rispetto a spot',
      'Flessibilità di utilizzo',
      'Priorità nelle richieste',
      'Nessun minimo per intervento',
    ],
    price: 400,
    priceUnit: 'una_tantum',
    category: 'post_lancio',
  },
  {
    id: 'seo_continuativa',
    name: 'SEO Continuativa',
    description: 'Ottimizzazione mensile: contenuti, link interni, monitoring',
    whyNeeded: 'La SEO non è un\'azione una tantum. Va coltivata nel tempo.',
    benefits: [
      'Crescita organica costante',
      'Contenuti ottimizzati ogni mese',
      'Monitoring posizioni',
      'Report e raccomandazioni',
    ],
    price: 800,
    priceUnit: 'mensile',
    category: 'post_lancio',
  },
  {
    id: 'ads_setup',
    name: 'Setup Campagne Ads',
    description: 'Configurazione Google Ads o Meta Ads con tracking',
    whyNeeded: 'Per portare traffico qualificato al sito in modo misurabile.',
    benefits: [
      'Traffico immediato e controllabile',
      'Targeting preciso',
      'Tracking conversioni integrato',
      'Budget ottimizzato',
    ],
    price: 1000,
    priceUnit: 'una_tantum',
    category: 'post_lancio',
  },
  {
    id: 'ads_gestione',
    name: 'Gestione Campagne Ads',
    description: 'Ottimizzazione mensile campagne Google/Meta Ads',
    whyNeeded: 'Le campagne vanno monitorate e ottimizzate costantemente.',
    benefits: [
      'Ottimizzazione continua',
      'A/B test creatività',
      'Report performance',
      'Gestione budget efficiente',
    ],
    price: 600,
    priceUnit: 'mensile',
    category: 'post_lancio',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getServicesByCategory(category: ServiceCategory): ServiceItem[] {
  return SERVICES.filter((s) => s.category === category);
}

export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceUnit(unit: ServiceItem['priceUnit']): string {
  const labels: Record<ServiceItem['priceUnit'], string> = {
    una_tantum: 'una tantum',
    mensile: '/mese',
    annuale: '/anno',
    trimestrale: '/trimestre',
    a_pagina: '/pagina',
    a_ora: '/ora',
  };
  return labels[unit];
}

export function calculateServicePrice(
  service: ServiceItem,
  quantity: number = 1
): { min: number; max: number } {
  return {
    min: service.priceMin * quantity,
    max: service.priceMax * quantity,
  };
}
