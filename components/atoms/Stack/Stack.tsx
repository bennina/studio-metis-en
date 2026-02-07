// components/atoms/Stack/Stack.tsx
import type { ElementType, FC, ReactNode } from 'react';
import {
  getStackClasses,
  type StackAlign,
  type StackDirection,
  type StackGap,
} from './Stack.style';

export interface StackProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
}

/**
 * Stack
 *
 * - direction="vertical" (default) → classico “spazio tra elementi in colonna”
 * - direction="horizontal" → righe con gap
 */
export const Stack: FC<StackProps> = ({
  as: Element = 'div',
  children,
  className = '',
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
}) => {
  const classes = getStackClasses({ direction, gap, align });

  return (
    <Element className={[classes.root, className].filter(Boolean).join(' ')}>
      {children}
    </Element>
  );
};
