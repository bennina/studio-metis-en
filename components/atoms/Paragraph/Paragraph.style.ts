// components/atoms/Paragraph/Paragraph.style.ts

export type ParagraphSize = 'sm' | 'md' | 'lg'; 
export type ParagraphTone = 'default' | 'muted' | 'white' | 'primary' | 'secondary' | 'accent';

export interface ParagraphStyleOptions {
  size?: ParagraphSize;
  tone?: ParagraphTone;
}

const sizeMap: Record<ParagraphSize, string> = {
  sm: 'text-md font-[400] [&_b]:font-[600]',
  md: 'text-lg font-[400] [&_b]:font-[600]',
  lg: 'text-xl font-[400] [&_b]:font-[600]',
};

const toneMap: Record<ParagraphTone, string> = {
  default: 'text-[var(--color-neutral-900)]',
  muted: 'text-[var(--color-neutral-600)]',
  primary: 'text-[var(--color-primary-700)]',
  white: 'text-[var(--color-neutral-100)]',
  secondary: 'text-[var(--color-neutral-700)]',
  accent: 'text-[var(--color-accent-900)]'
};

export function getParagraphClasses(options: ParagraphStyleOptions = {}) {
  const { size = 'md', tone = 'default' } = options;

  const base = ['font-sans', sizeMap[size], toneMap[tone]];

  return {
    root: base.filter(Boolean).join(' '),
  };
}
