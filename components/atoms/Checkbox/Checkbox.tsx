// components/atoms/Checkbox/Checkbox.tsx
import type { FC, InputHTMLAttributes, ReactNode } from "react";
import {
  getCheckboxClasses,
  type CheckboxSize,
} from "./Checkbox.style";

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  size?: CheckboxSize;
  /** Testo opzionale accanto alla checkbox */
  label?: ReactNode;
  /** Mostra lo stato visivo di errore */
  invalid?: boolean;
}

/**
 * Checkbox atom Athometis
 *
 * - Usa <input type="checkbox"> nascosto (peer)
 * - Box + icona SVG reagiscono a :checked
 * - Non forza "checked": se lo passi, gestiscilo come controlled component
 */
export const Checkbox: FC<CheckboxProps> = ({
  size = "md",
  label,
  invalid = false,
  disabled = false,
  className = "",
  id,
  ...rest
}) => {
  const classes = getCheckboxClasses({ size, invalid, disabled });

  const checkboxId = id;

  return (
    <label
      className={[classes.wrapper, className]
        .filter(Boolean)
        .join(" ")}
      htmlFor={checkboxId}
      aria-disabled={disabled || undefined}
    >
      {/* input reale, nascosto ma "peer" */}
      <input
        id={checkboxId}
        type="checkbox"
        className={classes.input}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />

      {/* box visivo */}
      <span className={classes.box} aria-hidden="true">
        <svg viewBox="0 0 16 16" className={classes.icon}>
          <polyline
            points="3.5 8.5 6.5 11.5 12.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {label && <span className={classes.label}>{label}</span>}
    </label>
  );
};
