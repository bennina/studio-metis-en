// components/atoms/Input/Input.tsx
import type {
  FC,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import {
  getInputClasses,
  type InputVariant,
  type InputSize,
} from './Input.style';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  fieldSize?: InputSize;
  fullWidth?: boolean;
  invalid?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input: FC<InputProps> = ({
  variant = 'default',
  fieldSize = 'md',
  fullWidth = true,
  invalid = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...rest
}) => {
  const classes = getInputClasses({
    variant,
    size: fieldSize,
    fullWidth,
    invalid,
    disabled,
    hasLeftIcon: !!leftIcon,
    hasRightIcon: !!rightIcon,
  });

  return (
    <div className={classes.wrapper}>
      {leftIcon && (
        <span className={classes.leftIcon} aria-hidden="true">
          {leftIcon}
        </span>
      )}

      <input
        className={[classes.input, className].filter(Boolean).join(' ')}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        {...rest}
      />

      {rightIcon && (
        <span className={classes.rightIcon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </div>
  );
};
