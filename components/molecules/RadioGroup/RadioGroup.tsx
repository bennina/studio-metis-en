'use client';
// components/molecules/RadioGroup/RadioGroup.tsx
import type { FC, ReactNode } from "react";
import { Radio } from "@/components/atoms";

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: ReactNode;        // Legend del gruppo
  helperText?: ReactNode;
  invalidText?: ReactNode;
  invalid?: boolean;
  required?: boolean;

  options: RadioGroupOption[];
  orientation?: "vertical" | "horizontal";
  className?: string;

  /** Per uso controllato */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const RadioGroup: FC<RadioGroupProps> = ({
  name,
  label,
  helperText,
  invalidText,
  invalid = false,
  required = false,
  options,
  orientation = "vertical",
  className = "",
  value,
  defaultValue,
  onChange,
}) => {
  const isControlled = value !== undefined;
// 👇 se options è undefined, usiamo un array vuoto
  const list = options ?? [];

  const wrapperClasses = [
    orientation === "horizontal"
      ? "flex flex-wrap gap-4 "
      : "flex flex-col gap-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // se non ci sono opzioni, non renderizziamo nulla (ma senza errori)
  if (list.length === 0) {
    return null;
  }

  const optionsClasses =
    orientation === "horizontal"
      ? "flex flex-wrap gap-4 "
      : "flex flex-col gap-3 ";

  return (
    <fieldset className={wrapperClasses}>
      {label && (
        <legend className="text-sm font-medium text-foreground mb-1">
          {label}
          {required && <span className="text-secondary-400 ml-1">*</span>}
        </legend>
      )}

      <div className={optionsClasses}>
        {list.map((opt) => (
          <Radio
            key={opt.value}
            name={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            invalid={invalid}
            checked={
              isControlled ? value === opt.value : undefined
            }
            defaultChecked={
              !isControlled && defaultValue === opt.value
                ? true
                : undefined
            }
            onChange={() => {
              onChange?.(opt.value);
            }}
          />
        ))}
      </div>

      {helperText && !invalid && (
        <p className="text-xs text-neutral-400 mt-1">
          {helperText}
        </p>
      )}

      {invalid && invalidText && (
        <p className="text-xs text-secondary-400 mt-1">
          {invalidText}
        </p>
      )}
    </fieldset>
  );
};
