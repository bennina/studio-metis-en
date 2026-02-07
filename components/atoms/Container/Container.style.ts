// components/atoms/Container/Container.style.ts

export type ContainerVariant = 'boxed' | 'full';
export type ContainerPaddingX = 'none' | 'sm' | 'md' | 'lg';

export interface ContainerStyleOptions {
  variant?: ContainerVariant;
  paddingX?: ContainerPaddingX;
  center?: boolean; // se true, applica mx-auto
}

const paddingXMap: Record<ContainerPaddingX, string> = {
  none: '',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
};

/**
 * Restituisce le classi per il container in base alle varianti.
 * - boxed: max-width + centrato
 * - full: larghezza piena
 */
export function getContainerClasses(options: ContainerStyleOptions = {}) {
  const {
    variant = 'boxed',
    paddingX = 'md',
    center = true,
  } = options;

  const base: string[] = ['w-full'];

  if (variant === 'boxed') {
    if (center) base.push('mx-auto');
    base.push('max-w-6xl');
  }

  base.push(paddingXMap[paddingX]);

  const className = base.filter(Boolean).join(' ');

  return {
    root: className,
  };
}
