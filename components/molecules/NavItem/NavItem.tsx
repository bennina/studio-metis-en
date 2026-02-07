// components/molecules/NavItem/NavItem.tsx
import type { FC, ReactNode } from 'react';
import {
  getNavItemClasses,
  getNavItemsWrapperClasses,
  type NavItemVariant,
} from './NavItem.style';

export interface NavItemProps {
  href: string;
  label: ReactNode;
  active?: boolean;
  variant?: NavItemVariant;
  className?: string;
  onClick?: () => void;
}

/**
 * Singola voce di navigazione
 *
 * Può essere usata:
 * - da sola
 * - wrappata da <Link href="..."> in Next
 */
export const NavItem: FC<NavItemProps> = ({
  href,
  label,
  active = false,
  variant = 'default',
  className = '',
  onClick,
}) => {
  const classes = getNavItemClasses({ active, variant });

  return (
    <a
      href={href}
      className={[classes.root, className].filter(Boolean).join(' ')}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export interface NavItemsProps {
  items: NavItemProps[];
  className?: string;
}

/**
 * Lista di voci di navigazione (ul + li)
 *
 * Ideale per il menu principale nella Navigation.
 */
export const NavItems: FC<NavItemsProps> = ({
  items,
  className = '',
}) => {
  const classes = getNavItemsWrapperClasses();

  return (
    <ul className={[classes.wrapper, className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={`${item.href}-${String(item.label)}`}>
          <NavItem {...item} />
        </li>
      ))}
    </ul>
  );
};
