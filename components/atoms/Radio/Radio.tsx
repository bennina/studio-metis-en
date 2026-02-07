// components/atoms/Radio/Radio.tsx
import type { FC, InputHTMLAttributes, ReactNode } from "react";
import {
  getRadioClasses,
  type RadioSize,
} from "./Radio.style";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  size?: RadioSize;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
}

export const Radio: FC<RadioProps> = ({
  size = "md",
  label,
  description,
  invalid = false,
  disabled = false,
  className = "",
  id,
  ...rest
}) => {
  const classes = getRadioClasses({ size, invalid, disabled });
  const radioId = id;

  return (
    <label
      className={[classes.wrapper, className]
        .filter(Boolean)
        .join(" ")}
      htmlFor={radioId}
      aria-disabled={disabled || undefined}
    >
      <input
        id={radioId}
        type="radio"
        className={classes.input}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />

      <span className={classes.outerCircle} aria-hidden="true">
        <span className={classes.innerDot} />
      </span>

      <span className="flex flex-col">
        {label && <span className={classes.label}>{label}</span>}
        {description && (
          <span className={classes.description}>{description}</span>
        )}
      </span>
    </label>
  );
};
