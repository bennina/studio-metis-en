// components/atoms/Divider/Divider.style.ts

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerTone = 'default' | 'muted';

export interface DividerStyleOptions {
  orientation?: DividerOrientation;
  tone?: DividerTone;
}

const toneMap: Record<DividerTone, string> = {
  default: 'bg-neutral-700',
  muted: 'bg-neutral-800',
};

export function getDividerClasses(options: DividerStyleOptions = {}) {
  const { orientation = 'horizontal', tone = 'muted' } = options;

  const base: string[] = [toneMap[tone], 'shrink-0'];

  if (orientation === 'horizontal') {
    base.push('h-px', 'w-full');
  } else {
    base.push('w-px', 'h-full');
  }

  return {
    root: base.filter(Boolean).join(' '),
  };
}
