// components/atoms/Divider/Divider.tsx
import type { FC } from 'react';
import {
  getDividerClasses,
  type DividerOrientation,
  type DividerTone,
} from './Divider.style';

export interface DividerProps {
  orientation?: DividerOrientation;
  tone?: DividerTone;
  className?: string;
}

/**
 * Divider
 *
 * - orientation="horizontal" (default) → linea orizzontale a larghezza piena
 * - orientation="vertical" → linea verticale a tutta altezza del container
 */
export const Divider: FC<DividerProps> = ({
  orientation = 'horizontal',
  tone = 'muted',
  className = '',
}) => {
  const classes = getDividerClasses({ orientation, tone });

  return (
    <div
      aria-hidden="true"
      className={[classes.root, className].filter(Boolean).join(' ')}
    />
  );
};
