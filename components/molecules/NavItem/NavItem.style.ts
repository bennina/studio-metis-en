// components/molecules/NavItem/NavItem.style.ts

export type NavItemVariant = 'default' | 'highlight';
export type NavItemAlign = 'left' | 'center' | 'right';

export interface NavItemStyleOptions {
  active?: boolean;
  variant?: NavItemVariant;
}

export function getNavItemClasses(options: NavItemStyleOptions = {}) {
  const { active = false, variant = 'default' } = options;

  const base: string[] = [
    'inline-flex',
    'items-center',
    'text-sm',
    'font-medium',
    'tracking-[0.08em]',
    'uppercase',
    'transition-colors',
    'duration-150',
    'text-foreground/80',
    'hover:text-foreground',
  ];

  if (active) {
    base.push('text-foreground');
  }

  if (variant === 'highlight') {
    base.push('text-primary-400', 'hover:text-primary-300');
  }

  return {
    root: base.filter(Boolean).join(' '),
  };
}

export function getNavItemsWrapperClasses() {
  const base: string[] = [
    'flex',
    'items-center',
    'gap-6',
  ];

  return {
    wrapper: base.filter(Boolean).join(' '),
  };
}
