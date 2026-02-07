// components/atoms/FormHelperText/FormHelperText.tsx
import type { FC, ReactNode } from 'react';
import {
  getFormHelperTextClasses,
  type FormHelperTone,
} from './FormHelperText.style';

export interface FormHelperTextProps {
  tone?: FormHelperTone;
  className?: string;
  children?: ReactNode;
  id?: string;
}

export const FormHelperText: FC<FormHelperTextProps> = ({
  tone = 'muted',
  className = '',
  children,
  id,
}) => {
  const classes = getFormHelperTextClasses({ tone });

  if (!children) return null;

  return (
    <p
      id={id}
      className={[classes.root, className].filter(Boolean).join(' ')}
    >
      {children}
    </p>
  );
};
