// components/molecules/Card/Card.style.ts

export type CardVariant = 'elevated' | 'outline' | 'subtle' | 'ghost' | 'glass' | 'secondary' | 'primary' | 'accent';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardStyleOptions {
  variant?: CardVariant;
  padding?: CardPadding;
  clickable?: boolean;
}

const paddingMap: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-12',
};

const variantMap: Record<CardVariant, string> = {
  secondary: 'bg-gradient-to-tl from-[var(--color-secondary-900)] via-[var(--color-secondary-600)] to-[var(--color-secondary-500)] rounded-xl space-y-6',
  accent: 'bg-gradient-to-tl from-[var(--color-accent-900)] via-[var(--color-accent-600)] to-[var(--color-accent-500)] rounded-xl space-y-6',
  primary: 'bg-gradient-to-tl from-primary-900 via-primary-600 to-[var(--color-primary-500)] rounded-xl space-y-6',
  elevated:
    'bg-[var(--color-neutral-900)] border border-[var(--color-neutral-800)] shadow-md shadow-black/15',
  outline:
    'bg-[var(--color-neutral-900)] border border-[var(--color-neutral-700)]',
  subtle: 'bg-[var(--color-neutral-900)]//80 border border-[var(--color-neutral-800)]/60',
  ghost: 'bg-[var(--color-neutral-500)]/30 backdrop-blur-none rounded-full ',
  glass: 'bg-[var(--color-neutral-300)]/30 rounded-2xl border-3 p-6 text-left transition flex flex-col items-start justify-between min-h-[140px] border-white/15 hover:border-white/35 ',
};

export function getCardClasses(options: CardStyleOptions = {}) {
  const {
    variant = 'elevated',
    padding = 'md',
    clickable = false,
  } = options;

  const base: string[] = [
    'relative',
    'rounded-lg',
    'transition',
    'duration-200',
    'overflow-hidden',
    variantMap[variant],
    paddingMap[padding],
  ];

  if (clickable) {
    base.push(
      'cursor-pointer',
      'hover:-translate-y-0.5',
      'hover:shadow-lg',
      'hover:shadow-black/25'
    );
  }

  return {
    root: base.filter(Boolean).join(' '),
  };
}
