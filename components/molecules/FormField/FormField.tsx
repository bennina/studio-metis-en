// components/molecules/FormField/FormField.tsx
import type { FC, ReactElement, ReactNode } from 'react';
import { cloneElement } from 'react';
import { FormLabel, FormHelperText } from "@/components/atoms";
import { getFormFieldClasses } from './FormField.style';

export interface FormFieldProps {
  id: string;
  label?: ReactNode;
  required?: boolean;
  invalid?: boolean;
  helperText?: ReactNode;
  errorText?: ReactNode;
  children: ReactElement<any>;
  className?: string;
}

/**
 * FormField
 *
 * Molecola che combina:
 * - Label
 * - Campo (Input/Textarea/Checkbox…)
 * - Helper/error text
 *
 * Si occupa di passare:
 * - id
 * - aria-invalid
 * - aria-describedby
 * al child.
 */
export const FormField: FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  invalid = false,
  helperText,
  errorText,
  children,
  className = '',
}) => {
  const classes = getFormFieldClasses();

  const helperId = helperText || errorText ? `${id}-helper` : undefined;

  const field = cloneElement(children, {
    id,
    'aria-invalid': invalid || undefined,
    'aria-describedby': helperId,
  });

  return (
    <div className={[classes.root, className].filter(Boolean).join(' ')}>
      {label && (
        <FormLabel htmlFor={id} requiredMark={required} tone={invalid ? 'error' : 'white'}>
          {label}
        </FormLabel>
      )}

      {field}

      {(helperText || errorText) && (
        <FormHelperText
          id={helperId}
          tone={invalid ? 'error' : 'muted'}
        >
          {invalid ? errorText || helperText : helperText}
        </FormHelperText>
      )}
    </div>
  );
};
