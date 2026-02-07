// components/atoms/FormLabel/FormLabel.style.ts

export type FormLabelTone = 'default' | 'muted' | 'white' | 'primary' | 'secondary' | 'accent' | 'error' ;

export interface FormLabelStyleOptions {
  tone?: FormLabelTone;
  disabled?: boolean;
}

const toneMap: Record<FormLabelTone, string> = {
  default: 'text-[var(--color-neutral-900)]',
  muted: 'text-primary-600',
  primary: 'text-[var(--color-primary-700)]',
  white: 'text-[var(--color-neutral-100)]',
  secondary: 'text-[var(--color-secondary-700)]',
  accent: 'text-[var(--color-accent-700)]',
  error: 'text-red-400',
};

export function getFormLabelClasses(options: FormLabelStyleOptions = {}) {
  const { tone = 'default', disabled = false } = options;

  const base: string[] = [
    'block',
    'text-xs',
    'font-medium',
    'tracking-[0.1em]',
    'uppercase',
    'transition-colors',
    'duration-150',
    'mb-1',
    toneMap[tone],
  ];

  if (disabled) {
    base.push('opacity-60', 'cursor-not-allowed');
  }

  return {
    root: base.filter(Boolean).join(' '),
  };
}
