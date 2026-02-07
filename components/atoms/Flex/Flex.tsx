// components/atoms/Flex/Flex.tsx
import type { ElementType, FC, ReactNode } from 'react';
import {
  getFlexClasses,
  type FlexAlign,
  type FlexDirection,
  type FlexJustify,
  type FlexWrap,
  type FlexGap,
} from './Flex.style';

export interface FlexProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
  gap?: FlexGap;
  inline?: boolean;
}

/**
 * Flex
 *
 * Atomo di layout generico, base per quasi tutte le righe/colonne.
 */
export const Flex: FC<FlexProps> = ({
  as: Element = 'div',
  children,
  className = '',
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  gap = 'none',
  inline = false,
}) => {
  const classes = getFlexClasses({ direction, align, justify, wrap, gap, inline });

  return (
    <Element className={[classes.root, className].filter(Boolean).join(' ')}>
      {children}
    </Element>
  );
};
