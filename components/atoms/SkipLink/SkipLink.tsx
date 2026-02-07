// components/atoms/SkipLink/SkipLink.tsx
import type { FC } from 'react';

export interface SkipLinkProps {
  /** ID dell'elemento target (es. "main-content") */
  targetId?: string;
  /** Testo del link */
  label?: string;
}

/**
 * SkipLink - Link per saltare direttamente al contenuto principale
 *
 * Accessibilità WCAG 2.4.1: Bypass Blocks
 * Permette agli utenti che navigano con tastiera di saltare
 * la navigazione ripetitiva e andare direttamente al contenuto.
 */
export const SkipLink: FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Vai al contenuto principale',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={[
        // Nascosto visivamente ma accessibile agli screen reader
        'sr-only',
        // Quando riceve focus, diventa visibile
        'focus:not-sr-only',
        'focus:fixed',
        'focus:top-4',
        'focus:left-4',
        'focus:z-[9999]',
        'focus:px-4',
        'focus:py-2',
        'focus:bg-primary-500',
        'focus:text-white',
        'focus:rounded-lg',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-300',
        'focus:ring-offset-2',
        'focus:shadow-lg',
        'focus:font-medium',
      ].join(' ')}
    >
      {label}
    </a>
  );
};
