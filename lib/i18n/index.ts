// lib/i18n/index.ts
// Internationalization module

export type { Locale, I18nConfig, Translations } from './types';

export {
  I18nProvider,
  useI18n,
  useTranslation,
  type I18nProviderProps,
} from './I18nProvider';

export { LanguageSelector } from './LanguageSelector';

export { briefTranslations, serviceTranslations } from './translations/brief';
