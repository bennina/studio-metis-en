// components/atoms/Container/Container.tsx
import type {
  ComponentPropsWithoutRef,
  ElementType,
  FC,
  ReactNode,
} from 'react';
import { getContainerClasses, type ContainerVariant, type ContainerPaddingX } from './Container.style';

export interface ContainerProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  variant?: ContainerVariant;
  paddingX?: ContainerPaddingX;
  center?: boolean;
}

/**
 * Container
 *
 * - variant="boxed" → max-width + centrato (default)
 * - variant="full"  → larghezza piena (utile per cover full-bleed, wall card, ecc.)
 */
export const Container: FC<ContainerProps> = ({
  as: Element = 'div',
  children,
  className = '',
  variant = 'boxed',
  paddingX = 'md',
  center = true,
}) => {
  const classes = getContainerClasses({ variant, paddingX, center });

  return (
    <Element className={[classes.root, className].filter(Boolean).join(' ')}>
      {children}
    </Element>
  );
};
