// components/atoms/Button/Button.style.ts

import { cn, createVariantMap } from '@/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'ghostPrimary' | 'ghostSecondary' | 'outlineDark' | 'outlineLight' | 'outlinePrimary' | 'outlineSecondary' | 'outlineAccent' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Custom class overrides from theme or JSON props */
  overrides?: {
    base?: string;
    variants?: Partial<Record<string, string>>;
    sizes?: Partial<Record<string, string>>;
  };
}

/** Default variant classes - can be overridden via theme */
export const defaultButtonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-900 text-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-primary-200)]',
  secondary: 'bg-[var(--color-secondary-700)] text-[var(--color-secondary-200)] hover:bg-[var(--color-secondary-900)] hover:text-[var(--color-secondary-200)]',
  accent: 'bg-[var(--color-accent-700)] text-[var(--color-accent-200)] hover:bg-[var(--color-accent-500)] hover:text-[var(--color-accent-900)]',
  glass: 'bg-[var(--color-neutral-400)]/30 backdrop-blur-xl rounded-full text-[var(--color-neutral-900)] border-b border-[var(--color-neutral-400)] hover:bg-[var(--color-neutral-600)]/30 hover:border-[var(--color-neutral-900)]',
  ghost: 'bg-primary-100/60 backdrop-blur-none rounded-full hover:text-primary-900 hover:bg-primary-100/100',
  ghostPrimary: 'bg-primary-900/60 text-[var(--color-primary-200)] backdrop-blur-none rounded-full hover:text-primary-900 hover:bg-primary-100/100',
  ghostSecondary: 'bg-[var(--color-secondary-900)]/60 text-[var(--color-secondary-100)] backdrop-blur-none rounded-full hover:text-[var(--color-secondary-900)] hover:bg-[var(--color-secondary-100)]/100',

  outlineDark: 'bg-transparent text-[var(--color-neutral-900)] border border-[var(--color-neutral-900)] hover:text-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-900)]',
  outlineLight: 'bg-transparent text-[var(--color-neutral-100)] border border-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]',

  outlinePrimary: 'bg-transparent text-[var(--color-primary-800)] border-2 border-[var(--color-primary-800)] hover:text-primary-100 hover:bg-[var(--color-primary-800)]',
  outlineSecondary: 'bg-transparent text-[var(--color-secondary-900)] border-2 border-[var(--color-secondary-900)] hover:text-[var(--color-secondary-600)] hover:bg-primary-900',
  outlineAccent: 'bg-transparent text-[var(--color-accent-800)] border-2 border-[var(--color-accent-800)] hover:text-[var(--color-accent-100)] hover:bg-[var(--color-accent-800)]',
};

/** Default size classes - can be overridden via theme */
export const defaultButtonSizes: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1',
  md: 'text-sm px-6 py-2',
  lg: 'text-md px-6 py-3',
};

/** Base classes applied to all buttons */
export const buttonBaseClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'rounded-full',
  '!font-[500]',
  'tracking-[.5]',
  'uppercase',
  'transition-all',
  'duration-500',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-primary-500',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-neutral-900',
  'disabled:opacity-60',
  'disabled:cursor-not-allowed',
  'hover:cursor-pointer',
  'rounded-2xl',
].join(' ');

export function getButtonClasses(options: ButtonStyleOptions = {}) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    overrides,
  } = options;

  // Merge default variants with overrides
  const variantMap = createVariantMap(defaultButtonVariants, overrides?.variants);
  const sizeMap = createVariantMap(defaultButtonSizes, overrides?.sizes);

  // Build class list
  const classes = cn(
    buttonBaseClasses,
    overrides?.base,
    variantMap[variant] || variantMap.primary,
    sizeMap[size] || sizeMap.md,
    fullWidth && 'w-full',
  );

  return {
    root: classes,
  };
}
