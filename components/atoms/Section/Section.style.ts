// components/atoms/Section/Section.style.ts

export type SectionPaddingY = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SectionRounded = 'none' | 'full' | 'justBottomLeft' | 'justBottomRight' | 'justLeft' | 'justRight' | 'justTopLeft' | 'justTopRight' ;
export type SectionBackground = 'default' | 'primary' | 'secondary' | 'subtle' | 'dark' | 'primaryGradients' | 'secondaryGradients' | 'subtleGradients' | 'darkGradients' | 'accent' | 'neutralGradients';

export interface SectionStyleOptions {
  paddingY?: SectionPaddingY;
  background?: SectionBackground;
  radius?: SectionRounded;
  fullWidth?: boolean;
}

const paddingYMap: Record<SectionPaddingY, string> = {
  none: 'py-0',
  sm: 'py-3',
  md: 'py-6',
  lg: 'py-12',
  xl: 'py-24',
};

const roudendMap: Record<SectionRounded, string> = {
  none: '',
  full: 'rounded-full',
  justBottomLeft: 'rounded-bl-full',
  justBottomRight: 'rounded-br-full w-[95%]',
  justLeft: 'rounded-l-full lg:ml-20',
  justRight: 'rounded-r-full w-[95%]',
  justTopLeft: 'rounded-tl-[3em] lg:rounded-tl-[30em] lg:pt-30',
  justTopRight: 'rounded-tr-full w-[95%]',
};

const backgroundMap: Record<SectionBackground, string> = {
  default: '',
  primary: 'bg-gradient-to-br from-primary-100 to-[var(--color-primary-500)] text-[var(--color-secondary-600)]',
  secondary: 'bg-[var(--color-secondary-600)] text-[var(--color-primary-500)]',
  accent: 'bg-gradient-to-br from-[var(--color-accent-100)] via-[var(--color-accent-200)] to-[var(--color-accent-600)] [&_p]:text-2xl [&_p]:text-[var(--color-accent-800)]',
  dark: 'bg-neutral-900 text-primary-900',
  subtle: 'bg-[var(--color-secondary-600)] [&_header_*]:text-[var(--color-accent-600)]',
  primaryGradients: 'bg-gradient-to-tl from-[var(--color-primary-300)] to-primary-600',
  secondaryGradients: 'bg-gradient-to-tl from-[var(--color-secondary-300)] to-[var(--color-secondary-600)]',
  subtleGradients: 'bg-gradient-to-tl from-[var(--color-accent-100)]/60 to-[var(--color-accent-600)]',
  darkGradients: 'bg-gradient-to-tl from-[var(--color-neutral-300)] to-[var(--color-neutral-600)]',
  neutralGradients: 'bg-neutral-100/30 backdrop-blur-xl border-b border-neutral-100',
};

export function getSectionClasses(options: SectionStyleOptions = {}) {
  
  const {
    paddingY = 'md',
    background = 'default',
    radius = 'none',
    fullWidth = true,
  } = options;

  const root: string[] = [backgroundMap[background], roudendMap[radius], paddingYMap[paddingY] ];

  if (!fullWidth) {
    root.push('max-w-container-max-width', 'mx-auto');
  }

  return {
    root: root.filter(Boolean).join(' '),
  };
}
