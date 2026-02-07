// components/atoms/Checkbox/Checkbox.style.ts

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxStyleOptions {
  size?: CheckboxSize;
  invalid?: boolean;
  disabled?: boolean;
}

const sizeMap: Record<CheckboxSize, string> = {
  sm: "w-3 h-3 text-[10px]",
  md: "w-5 h-5 text-[11px]",
  lg: "w-6 h-6 text-[12px]",
};

export function getCheckboxClasses(
  options: CheckboxStyleOptions = {}
) {
  const { size = "sm", invalid = false, disabled = false } = options;

  const wrapper: string[] = [
    "inline-flex",
    "items-center",
    "gap-2",
    "select-none",
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
  ];

  const box: string[] = [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-[4px]",
    "border",
    "border-[var(--color-primary-500)]",
    "bg-[var(--color-primary-500)]",
    
    "transition-colors",
    "duration-150",
    "peer-focus-visible:outline-none",
    "peer-focus-visible:ring-2",
    "peer-focus-visible:ring-[var(--color-primary-500)]",
    "peer-focus-visible:ring-offset-2",
    "peer-focus-visible:ring-[var(--color-primary-500)]",
    "peer-checked:bg-[var(--color-secondary-600)]",
    "peer-checked:border-[var(--color-secondary-600)]",
    "peer-checked:text-[var(--color-secondary-600)]",
    sizeMap[size],
  ];

  if (invalid) {
    box.push(
      "border-red-400",
      "peer-checked:bg-red-400",
      "peer-checked:border-red-400",
      "peer-focus-visible:ring-red-400"
    );
  }

  const label: string[] = [
    'text-sm',
    'font-normal',
    'text-[var(--color-secondary-100)]',
    'tracking-[0.05em]',
    'transition-colors',
    disabled ? "opacity-80" : "",
  ];

  const input = "peer sr-only";

  const icon =
    "opacity-0 peer-checked:opacity-100 transition-opacity duration-150 text-neutral-950 pointer-events-none";

  return {
    wrapper: wrapper.filter(Boolean).join(" "),
    box: box.filter(Boolean).join(" "),
    label: label.filter(Boolean).join(" "),
    input,
    icon,
  };
}
