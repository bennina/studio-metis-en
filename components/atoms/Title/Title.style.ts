// components/atoms/Title/Title.style.ts

export type TitleVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'eyebrow'
  | 'subtitle';

export type TitleTone = 'default' | 'muted' | 'white' | 'primary' | 'secondary' | 'accent';

export interface TitleStyleOptions {
  variant?: TitleVariant;
  tone?: TitleTone;
}

const variantMap: Record<TitleVariant, string> = {
  h1: 'text-4xl sm:text-5xl md:text-6xl font-[400] [&_b]:font-[600] tracking-wide',
  h2: 'text-3xl sm:text-4xl md:text-5xl font-[400] [&_b]:font-[600] tracking-wide',
  h3: 'text-2xl sm:text-3xl font-[400] tracking-wide [&_b]:font-[600]',
  h4: 'text-xl sm:text-2xl font-[400] [&_b]:font-[600]',
  h5: 'text-lg font-[400] [&_b]:font-[600]',
  h6: 'text-base font-[400] [&_b]:font-[600]',
  eyebrow: 'text-md font-[600] [&_b]:font-[600]  uppercase font-hylight  tracking-wide',
  subtitle: 'text-sm font-[600] [&_b]:font-bold',
};

const toneMap: Record<TitleTone, string> = {
  default: 'text-[var(--color-neutral-900)]',
  muted: 'text-primary-600',
  primary: 'text-[var(--color-primary-700)]',
  white: 'text-[var(--color-neutral-100)]',
  secondary: 'text-[var(--color-secondary-700)]',
  accent: 'text-[var(--color-accent-700)]',
};

export function getTitleClasses(options: TitleStyleOptions = {}) {
  const {
    variant = 'h2',
    tone = variant === 'eyebrow' || variant === 'subtitle'
      ? 'muted'
      : 'default',
  } = options;

  const base = [variantMap[variant], toneMap[tone]];

  return {
    root: base.filter(Boolean).join(' '),
  };
}
