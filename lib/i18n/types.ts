// lib/i18n/types.ts
// Internationalization types for the Brief Builder

export type Locale = 'it' | 'en' | 'fr';

export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
}

export type TranslationKey = string;

export type Translations = {
  [key: string]: string | Translations;
};

export type LocaleTranslations = {
  [L in Locale]: Translations;
};
