'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from './I18nProvider';
import type { Locale } from './types';

const LOCALES: Locale[] = ['it', 'en', 'fr'];

interface LanguageSelectorProps {
  className?: string;
}

/**
 * Language Switcher Badge
 *
 * Closed: circular badge showing current locale code (e.g. "EN").
 * Open:   pill expands to show all available locales;
 *         the active one stays highlighted in a filled circle on the left.
 */
export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSelect = (loc: Locale) => {
    setLocale(loc);
    setIsOpen(false);
  };

  const otherLocales = LOCALES.filter((l) => l !== locale);

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      {/* ── Expanded pill (open state) ── */}
      <div
        className={[
          'flex items-center',
          'bg-[var(--color-primary-900)]',
          'rounded-full',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'gap-6 pl-1 pr-6 py-1' : 'gap-0 p-0',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        role="radiogroup"
        aria-label="Select language"
      >
        {/* Active locale — circle badge */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className={[
            'flex items-center justify-center',
            'w-12 h-12 rounded-full',
            'bg-[var(--color-primary-700)]',
            'border-2 border-[var(--color-primary-500)]',
            'text-[var(--color-primary-200)]',
            'text-sm font-semibold uppercase',
            'transition-transform duration-200',
          ].join(' ')}
          aria-checked="true"
          role="radio"
          aria-label={locale}
        >
          {locale}
        </button>

        {/* Other locales */}
        {otherLocales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => handleSelect(loc)}
            className={[
              'text-[var(--color-primary-300)]',
              'text-sm font-semibold uppercase',
              'hover:text-[var(--color-primary-100)]',
              'transition-colors duration-150',
              'cursor-pointer',
            ].join(' ')}
            role="radio"
            aria-checked="false"
            aria-label={loc}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* ── Collapsed badge (closed state) ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={[
          'flex items-center justify-center',
          'w-12 h-12 rounded-full',
          'bg-[var(--color-primary-900)]',
          'border-2 border-[var(--color-primary-700)]',
          'text-[var(--color-primary-200)]',
          'text-sm font-semibold uppercase',
          'transition-all duration-300 ease-in-out',
          'hover:border-[var(--color-primary-500)]',
          'hover:bg-[var(--color-primary-800)]',
          isOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100',
        ].join(' ')}
        aria-label={`Current language: ${locale}. Click to change.`}
        aria-expanded={isOpen}
      >
        {locale}
      </button>
    </div>
  );
}
