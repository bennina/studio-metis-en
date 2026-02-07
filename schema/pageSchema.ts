// schema/pageSchema.ts
export interface QuizOptionSchema {
  value: string;
  label: string;
  description?: string;
  score?: number;
  disabled?: boolean;
}

export type QuizStepTypeSchema = "radio" | "contact";

export interface QuizStepSchema {
  
  id: string;
  title: string;
  type: QuizStepTypeSchema;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  options?: QuizOptionSchema[];
  fields?: FormCardFieldSchema[]; // riusa i campi del form-card per la contact step
}

export interface QuizCardSectionSchema extends BaseSectionSchema {
  type: "quiz-card";
  backgroundImage?: ImageAsset;
  layout?: {
    withOverlay?: boolean;
    paddingY?: "sm" | "md" | "lg" | "xl" | "full";
    alignX?: "left" | "center" | "right";
    alignY?: "top" | "center" | "bottom";
    height?: "sm" | "md" | "lg" | "full";
    radius?: SectionRounded;
  };
  content: {
    tone?: TitleTone;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
  };
  secondaryText?: string;
  quiz: {
    quizId: string;
    submitLabel?: string;
    formAction?: string;
    progressAction?: string;
    steps: QuizStepSchema[];
    pricing: {
      baseMin: number;
      baseMax: number;
      scoreMultiplierMin: number;
      scoreMultiplierMax: number;
      capMin: number;
      capMax: number;
    };
  };
}

import {
  CardVariant,
  SectionBackground,
  SectionPaddingY,
  SectionRounded,
  TitleTone,
} from "@/components";
import { ReactNode } from "react";

/** Immagine riusabile in tutto lo schema */
export interface ImageAsset {
  src: string;
  alt: string;
  title?: string;
  /** es: "4:3", "16:9" – opzionale, diamo fallback nel mapper */
  aspectRatio?: string;
  /** per future GEO/SEO estese */
  focalPoint?: { x: number; y: number }; // 0–1
}

/** CTA generica */
export interface CtaSchema {
  label: string;
  href: string;
  external?: boolean;
}

/** Meta SEO/GEO a livello pagina */
export interface SeoMetaSchema {
  title: string;
  description?: string;
  canonicalUrl?: string;
  locale?: string; // es. "it-IT"
  ogImage?: string;
  /** Hint per generative engine (ChatGPT & co) – opzionale */
  geSummaryHint?: string;
}

/** Opzioni di layout comuni alle sezioni */
export type SectionBackgroundSchema = SectionBackground;
export type SectionPaddingYSchema = SectionPaddingY;

export interface BaseSectionSchema {
  id?: string;
  type: string;
  anchor?: string; // es. "servizi"
  background?: SectionBackgroundSchema;
  paddingY?: SectionPaddingYSchema;
}

/**
 * SIMPLE CONTENT
 * – testo + colonne + CTA, senza immagine
 */
export interface SimpleContentSectionSchema extends BaseSectionSchema {
  type: "simple-content";
  content: {
    tone?: TitleTone;
    isFirst?: boolean;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    columns?: {
      title?: string;
      subtitle?: string;
      description?: string;
    }[];
    accordions?: {
      title: string;
      description?: string;
      content?: string;
      defaultOpen?: boolean;
    }[];
    body?: string;
  };
  primaryCta?: CtaSchema;
  secondaryCta?: CtaSchema;
}

/**
 * TEXT + MEDIA
 * – immagine + content block
 */
export type TextMediaPositionSchema = "left" | "right";
export type TextMediaAlignYSchema = "top" | "center" | "bottom";
export type TextMediaAlignTextSchema = "left" | "center";

export interface TextMediaSectionSchema extends BaseSectionSchema {
  type: "text-media";
  layout?: {
    paddingY?: "sm" | "md" | "lg" | "full";
    mediaPosition?: TextMediaPositionSchema;
    textAlignY?: TextMediaAlignYSchema;
    alignText?: TextMediaAlignTextSchema;
    width?: "narrow" | "normal" | "wide";
  };
  content: {
    isFirst?: boolean;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    columns?: {
      title?: string;
      subtitle?: string;
      description?: string;
    }[];
    body?: string;
  };
  media: ImageAsset;
  primaryCta?: CtaSchema;
  secondaryCta?: CtaSchema;
}

/**
 * COVER
 * – hero full-bleed con background e blocco content
 */
export interface CoverSectionSchema extends BaseSectionSchema {
  type: "cover";
  backgroundImage?: ImageAsset;
  background?: SectionBackgroundSchema;
  layout?: {
    paddingY?: "sm" | "md" | "lg" | "xl" | "full";
    alignX?: "left" | "center" | "right";
    alignY?: "top" | "center" | "bottom";
    height?: "sm" | "md" | "lg" | "full";
    radius?: SectionRounded;
    contentVariant?: "plain" | "card";
    withOverlay?: boolean;
  };
  content: {
    isFirst?: boolean;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    tone?: TitleTone;
    columns?: {
      title?: string;
      subtitle?: string;
      description?: string;
    }[];
  };
  
  primaryCta?: CtaSchema;
  secondaryCta?: CtaSchema;
}

/**
 * WALL CARD
 * – lista di card a muro
 */
export interface WallCardItemSchema {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  description?: string;
  meta?: {
    priceLabel?: string;
    priceValue?: string;
  };
  media?: ImageAsset | null;
  iconName?: string; // es. "chart", "bolt" – la risolvi tu nel mapper
  cta?: CtaSchema;
}

export interface WallCardSectionSchema extends BaseSectionSchema {
  type: "wall-card";
  background?: SectionBackgroundSchema;
  header?: {
    isFirst?: boolean;
    tone?: TitleTone;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    columns?: {
      title?: string;
      subtitle?: string;
      description?: string;
    }[];
  };
  layout?: {
    cardVariant?: CardVariant;
    align?: "left" | "center";
    columnsMobile?: 1 | 2;
    columnsDesktop?: 2 | 3 | 4;
    gap?: "sm" | "md" | "lg";
    ctaPlacement?: "header" | "footer" | "both" | "none";
  };
  items: WallCardItemSchema[];
  primaryCta?: CtaSchema;
  secondaryCta?: CtaSchema;
}

/**
 * FORM CARD
 * – cover con form dentro una card
 */
export type FormCardFieldTypeSchema =
  | "text"
  | "email"
  | "textarea"
  | "checkbox"
  | "radio";

export interface FormCardFieldSchema {
  type: FormCardFieldTypeSchema;
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  rows?: number; // per textarea
  options?: {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
  }[];
}

export interface FormCardSectionSchema extends BaseSectionSchema {
  type: "form-card";
  backgroundImage?: ImageAsset;
  background?: SectionBackgroundSchema;
  layout?: {
    withOverlay?: boolean;
    paddingY?: "sm" | "md" | "lg" | "xl" | "full";
    alignX?: "left" | "center" | "right";
    alignY?: "top" | "center" | "bottom";
    height?: "sm" | "md" | "lg" | "full";
    radius?: SectionRounded;
  };
  content: {
    tone?: TitleTone;
    isFirst?: boolean;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
  };
  form: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  primaryCta?: CtaSchema;
  fields: FormCardFieldSchema[];
  submitLabel?: string;
  secondaryText?: string;
  formAction?: string;
  formMethod?: "get" | "post";
}

/** Union di tutte le sezioni gestite dal tema */
export type SectionSchema =
  | SimpleContentSectionSchema
  | TextMediaSectionSchema
  | CoverSectionSchema
  | WallCardSectionSchema
  | FormCardSectionSchema
  | QuizCardSectionSchema;

/** Config della pagina (pensata per JSON) */
export interface PageSchema {
  slug: string;
  seo: SeoMetaSchema;
  variant: "default" | "landing",
  sections: SectionSchema[];
}


