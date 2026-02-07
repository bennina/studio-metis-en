// components/atoms/Textarea/Textarea.tsx
import type {
  FC,
  TextareaHTMLAttributes,
} from 'react';
import {
  getTextareaClasses,
  type TextareaSize,
} from './Textarea.style';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldSize?: TextareaSize;
  fullWidth?: boolean;
  invalid?: boolean;
}

export const Textarea: FC<TextareaProps> = ({
  fieldSize = 'md',
  fullWidth = true,
  invalid = false,
  className = '',
  disabled,
  ...rest
}) => {
  const classes = getTextareaClasses({
    size: fieldSize,
    fullWidth,
    invalid,
    disabled,
  });

  return (
    <textarea
      className={[classes.textarea, className].filter(Boolean).join(' ')}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      {...rest}
    />
  );
};
