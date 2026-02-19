// app/brief/BriefPageClient.tsx
'use client';

import { useState } from 'react';
import { BriefBuilder } from '@/components/sections/BriefBuilder';
import { I18nProvider, LanguageSelector, briefTranslations } from '@/lib/i18n';
import type { BriefData } from '@/lib/brief/briefTypes';
import type { Locale } from '@/lib/i18n';

export function BriefPageClient() {
  const [locale, setLocale] = useState<Locale>('it');

  const handleGenerate = async (data: BriefData) => {
    try {
      const response = await fetch('/api/brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });

      if (response.ok) {
        const html = await response.text();

        // Apri il preventivo in una nuova finestra per la stampa
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
        }
      } else {
        console.error('Error generating brief');
        alert('Errore nella generazione del preventivo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Errore nella generazione del preventivo');
    }
  };

  return (
    <I18nProvider defaultLocale={locale} translations={briefTranslations}>
      <div className="min-h-screen bg-neutral-900">
        {/* Language selector header */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>
        <BriefBuilder onGenerate={handleGenerate} locale={locale} />
      </div>
    </I18nProvider>
  );
}
