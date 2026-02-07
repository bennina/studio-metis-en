// components/molecules/SocialLink/SocialLink.tsx
import type { FC, ReactNode } from 'react';
import {
  ButtonSizeVariant,
  getSocialLinkClasses,
  type SocialLinkVariant,
} from './SocialLink.style';

export interface SocialLinkProps {
  href: string;
  icon?: ReactNode;
  label?: string;
  variant?: SocialLinkVariant;
  size?: ButtonSizeVariant;
  className?: string;
  newTab?: boolean;
}

export const SocialLink: FC<SocialLinkProps> = ({
  href,
  icon,
  label,
  size,
  variant = 'default',
  className = '',
  newTab = true,
}) => {
  const classes = getSocialLinkClasses({ variant, size });

  return (
    <a
      href={href}
      className={[classes.root, className].filter(Boolean).join(' ')}
      aria-label={label}
      title={label}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer noopener' : undefined}
    >
      {icon && (
        <span className={classes.icon}>{icon}</span>
      )}
      {label && variant === 'pill' && (
        <span className={'text-xs'}>{label}</span>
      )}
    </a>
  );
};
