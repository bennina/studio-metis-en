'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Locale, Translations } from './types';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Translations;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
  translations: Record<Locale, Translations>;
}

/**
 * Get nested value from object by dot-notation key
 */
function getNestedValue(obj: Translations, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Replace params in string: "Hello {name}" + {name: "World"} => "Hello World"
 */
function interpolate(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() ?? `{${key}}`;
  });
}

export function I18nProvider({
  children,
  defaultLocale = 'it',
  translations,
}: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const currentTranslations = useMemo(
    () => translations[locale] || translations.it || {},
    [locale, translations]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = getNestedValue(currentTranslations, key);
      if (!value) {
        console.warn(`[i18n] Missing translation for key: ${key}`);
        return key;
      }
      return interpolate(value, params);
    },
    [currentTranslations]
  );

  const contextValue = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      translations: currentTranslations,
    }),
    [locale, t, currentTranslations]
  );

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access i18n context
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}

/**
 * Hook to get translation function only (simpler API)
 */
export function useTranslation() {
  const { t, locale, setLocale } = useI18n();
  return { t, locale, setLocale };
}
