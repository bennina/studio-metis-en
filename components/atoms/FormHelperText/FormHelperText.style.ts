// components/atoms/FormHelperText/FormHelperText.style.ts

export type FormHelperTone = 'default' | 'muted' | 'error';

export interface FormHelperTextStyleOptions {
  tone?: FormHelperTone;
}

const toneMap: Record<FormHelperTone, string> = {
  default: 'text-foreground',
  muted: 'text-muted',
  error: 'text-red-400',
};

export function getFormHelperTextClasses(
  options: FormHelperTextStyleOptions = {}
) {
  const { tone = 'muted' } = options;

  const base: string[] = ['mt-1', 'text-xs', toneMap[tone]];

  return {
    root: base.filter(Boolean).join(' '),
  };
}
