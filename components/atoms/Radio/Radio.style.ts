// components/atoms/Radio/Radio.style.ts

export type RadioSize = "sm" | "md" | "lg";

export interface RadioStyleOptions {
  size?: RadioSize;
  invalid?: boolean;
  disabled?: boolean;
}

const sizeMap: Record<RadioSize, string> = {
  sm: "w-4 h-4 text-[10px]",
  md: "w-5 h-5 text-[11px]",
  lg: "w-6 h-6 text-[12px]",
};

export function getRadioClasses(options: RadioStyleOptions = {}) {
  const { size = "md", invalid = false, disabled = false } = options;

  const wrapper: string[] = [
    "inline-flex",
    "items-center",
    "gap-2",
    "select-none",
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
  ];

  const input = "peer sr-only";

  const outerCircle: string[] = [
    "flex items-center justify-center",
    "rounded-full",
    "border",
    "border-[var(--color-accent-500)]",
    "bg-[var(--color-accent-300)]",
    "transition-colors duration-150",
    "peer-focus-visible:outline-none",
    "peer-focus-visible:ring-2",
    "peer-focus-visible:ring-[var(--color-accent-500)]",
    "peer-focus-visible:ring-offset-2",
    "peer-focus-visible:ring-offset-[var(--color-accent-500)]",
    "peer-checked:border-[var(--color-secondary-600)]",
    "peer-checked:border-4",
    sizeMap[size],
  ];

  if (invalid) {
    outerCircle.push(
      "border-red-400",
      "peer-checked:border-red-400",
      "peer-focus-visible:ring-red-400"
    );
  }

  const innerDot: string[] = [
    "rounded-full",
    "bg-[var(--color-accent-600)]",
    "w-1 h-1",
    "opacity-0",
    "peer-checked:opacity-100",
    "transition-opacity duration-150",
  ];

  const label: string[] = [
    "text-sm",
    "text-primary-600",
    'uppercase',
    "leading-[2px]",
    
    disabled ? "opacity-80" : "",
  ];

  const description: string[] = [
    "text-xs",
    "text-[var(--color-primary-500)]",
    "mt-0.5",
    "leading-snug",
    
  ];

  return {
    wrapper: wrapper.filter(Boolean).join(" "),
    input,
    outerCircle: outerCircle.filter(Boolean).join(" "),
    innerDot: innerDot.filter(Boolean).join(" "),
    label: label.filter(Boolean).join(" "),
    description: description.filter(Boolean).join(" "),
  };
}
