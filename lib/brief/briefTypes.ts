// lib/brief/briefTypes.ts

/**
 * Tipi per il Brief Builder
 */

export interface ClientInfo {
  projectName: string;
  companyName: string;
  sector: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface CurrentSituation {
  hasSite: 'no' | 'rebuild' | 'improve';
  hasDomain: boolean;
  domainName?: string;
  hasHosting: boolean;
  hasEmail: boolean;
  hasBrandIdentity: boolean;
  hasContent: 'none' | 'partial' | 'complete';
  currentSiteUrl?: string;
  notes?: string;
}

export interface ProjectObjectives {
  mainGoal: 'leads' | 'sales' | 'presence' | 'events' | 'other';
  goalDescription?: string;
  targetAudience: string;
  competitors?: string;
  timeline: 'urgent' | '1month' | '2months' | '3months' | 'flexible';
  budgetRange: 'under2k' | '2k-5k' | '5k-10k' | '10k-20k' | 'over20k';
}

export interface SelectedService {
  serviceId: string;
  quantity: number;
  notes?: string;
  customPrice?: number;
}

export interface BriefData {
  id?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';

  // Sezioni del brief
  clientInfo: ClientInfo;
  currentSituation: CurrentSituation;
  objectives: ProjectObjectives;

  // Servizi selezionati per categoria
  selectedSiteType?: string;
  selectedServices: SelectedService[];

  // Calcoli
  total: number;
  recurring: number;

  // Timeline e note
  estimatedWeeks: number;
  internalNotes?: string;
  clientNotes?: string;

  // Sconti e condizioni
  discountPercent?: number;
  discountReason?: string;
  paymentTerms?: string;
  validityDays: number;
}

export interface BriefSummaryItem {
  category: string;
  serviceName: string;
  description: string;
  quantity: number;
  price: number;
  priceUnit: string;
  isRecurring: boolean;
}

export const TIMELINE_LABELS: Record<ProjectObjectives['timeline'], string> = {
  urgent: 'Urgente (entro 2 settimane)',
  '1month': 'Entro 1 mese',
  '2months': 'Entro 2 mesi',
  '3months': 'Entro 3 mesi',
  flexible: 'Flessibile',
};

export const BUDGET_LABELS: Record<ProjectObjectives['budgetRange'], string> = {
  under2k: 'Fino a €2.000',
  '2k-5k': '€2.000 - €5.000',
  '5k-10k': '€5.000 - €10.000',
  '10k-20k': '€10.000 - €20.000',
  over20k: 'Oltre €20.000',
};

export const GOAL_LABELS: Record<ProjectObjectives['mainGoal'], string> = {
  leads: 'Generare più contatti/richieste',
  sales: 'Vendere online (e-commerce)',
  presence: 'Presenza professionale online',
  events: 'Promuovere eventi/corsi',
  other: 'Altro obiettivo',
};

export const SITE_STATUS_LABELS: Record<CurrentSituation['hasSite'], string> = {
  no: 'Non ho ancora un sito',
  rebuild: 'Ho un sito, ma va rifatto',
  improve: 'Ho un sito, da migliorare',
};

export const CONTENT_STATUS_LABELS: Record<CurrentSituation['hasContent'], string> = {
  none: 'Non ho nulla, va creato tutto',
  partial: 'Ho qualcosa, ma va sistemato',
  complete: 'Ho tutto pronto (testi e foto)',
};

// Default values per nuovo brief
export function createEmptyBrief(): BriefData {
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    clientInfo: {
      projectName: '',
      companyName: '',
      sector: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    },
    currentSituation: {
      hasSite: 'no',
      hasDomain: false,
      hasHosting: false,
      hasEmail: false,
      hasBrandIdentity: false,
      hasContent: 'none',
    },
    objectives: {
      mainGoal: 'leads',
      targetAudience: '',
      timeline: '2months',
      budgetRange: '2k-5k',
    },
    selectedServices: [],
    total: 0,
    recurring: 0,
    estimatedWeeks: 4,
    validityDays: 30,
  };
}
