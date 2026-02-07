// components/atoms/Section/Section.tsx
import type {
  ElementType,
  FC,
  ReactNode,
  HTMLAttributes,
} from 'react';
import {
  getSectionClasses,
  type SectionPaddingY,
  type SectionRounded,
  type SectionBackground,
} from './Section.style';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  paddingY?: SectionPaddingY;
  background?: SectionBackground;
  radius?: SectionRounded;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Section: FC<SectionProps> = ({
  as: Component = 'section',
  paddingY = 'xl',
  background = 'default',
  radius = 'none',
  fullWidth = true,
  className = '',
  children,
  ...rest
}) => {
  
  const classes = getSectionClasses({ paddingY, background,radius, fullWidth });
  return (
    <Component
      className={[classes.root, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
};
