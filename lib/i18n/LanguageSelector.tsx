'use client';

import { useTranslation } from './I18nProvider';
import type { Locale } from './types';

const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  it: { label: 'Italiano', flag: '🇮🇹' },
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
};

interface LanguageSelectorProps {
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'minimal';
}

export function LanguageSelector({
  className = '',
  variant = 'buttons',
}: LanguageSelectorProps) {
  const { locale, setLocale } = useTranslation();

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={`px-2 py-1 text-xs uppercase rounded transition-colors ${
              locale === loc
                ? 'bg-primary-500 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className={`bg-neutral-800 text-white border border-neutral-600 rounded px-3 py-2 text-sm ${className}`}
      >
        {(Object.entries(LOCALE_LABELS) as [Locale, { label: string; flag: string }][]).map(
          ([loc, { label, flag }]) => (
            <option key={loc} value={loc}>
              {flag} {label}
            </option>
          )
        )}
      </select>
    );
  }

  // Default: buttons
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {(Object.entries(LOCALE_LABELS) as [Locale, { label: string; flag: string }][]).map(
        ([loc, { label, flag }]) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              locale === loc
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </button>
        )
      )}
    </div>
  );
}
