// components/atoms/Stack/Stack.style.ts

export type StackDirection = 'vertical' | 'horizontal';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

export interface StackStyleOptions {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
}

const gapMap: Record<StackGap, string> = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const alignMap: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export function getStackClasses(options: StackStyleOptions = {}) {
  const {
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
  } = options;

  const base: string[] = ['flex', gapMap[gap], alignMap[align]];

  if (direction === 'vertical') {
    base.push('flex-col');
  } else {
    base.push('flex-row');
  }

  const className = base.filter(Boolean).join(' ');

  return {
    root: className,
  };
}
