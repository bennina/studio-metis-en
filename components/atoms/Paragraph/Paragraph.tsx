// components/atoms/Paragraph/Paragraph.tsx
import type { FC, ReactNode } from 'react';
import {
  getParagraphClasses,
  type ParagraphSize,
  type ParagraphTone,
} from './Paragraph.style';

export interface ParagraphProps {
  as?: 'p' | 'span' | 'div';
  size?: ParagraphSize;
  tone?: ParagraphTone;
  className?: string;
  children?: ReactNode;
  /**
   * Contenuto HTML (es. proveniente da JSON/CMS).
   * Ha priorità su `children`.
   * ATTENZIONE: assicurati che sia già sanificato se arriva da input esterno.
   */
  html?: string;
}

export const Paragraph: FC<ParagraphProps> = ({
  as: Component = 'p',
  size = 'md',
  tone = 'default',
  className = '',
  html,
  children,
}) => {
  const classes = getParagraphClasses({ size, tone });
  const mergedClassName = [classes.root, className].filter(Boolean).join(" ");
  return (
    <Component
        className={mergedClassName}
        dangerouslySetInnerHTML={{ __html: children ? String(children) : (html ?? "") }}
      />
  );
};
