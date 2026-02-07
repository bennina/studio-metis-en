// components/atoms/FormLabel/FormLabel.tsx
import type { FC, LabelHTMLAttributes, ReactNode } from 'react';
import {
  getFormLabelClasses,
  type FormLabelTone,
} from './FormLabel.style';

export interface FormLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'disabled'> {
  tone?: FormLabelTone;
  requiredMark?: boolean;
  /** Stato disabilitato “logico” del campo collegato */
  disabled?: boolean;
  children?: ReactNode;
}

export const FormLabel: FC<FormLabelProps> = ({
  tone = 'default',
  requiredMark = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) => {
  const classes = getFormLabelClasses({
    tone,
    disabled,
  });

  return (
    <label
      className={[classes.root, className].filter(Boolean).join(' ')}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {children}
      {requiredMark && (
        <span className="ml-0.5 text-red-400" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};
