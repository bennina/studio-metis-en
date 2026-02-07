// components/molecules/Card/Card.tsx
import type { ElementType, FC, ReactNode } from 'react';
import {
  getCardClasses,
  type CardVariant,
  type CardPadding,
} from './Card.style';

export interface CardProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  clickable?: boolean;
}

export const Card: FC<CardProps> = ({
  as: Element = 'article',
  children,
  className = '',
  variant = 'elevated',
  padding = 'md',
  clickable = false,
}) => {
  const classes = getCardClasses({ variant, padding, clickable });

  return (
    <Element className={[classes.root, className].filter(Boolean).join(' ')}>
      {children}
    </Element>
  );
};
