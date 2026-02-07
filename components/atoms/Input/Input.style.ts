// components/atoms/Input/Input.style.ts

export type InputVariant = 'default' | 'ghost' | 'secondary' | 'glass';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputStyleOptions {
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
}

const sizeMap: Record<InputSize, string> = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-11 text-base',
};

const paddingBase = 'px-sm'; // 8px
const paddingWithLeftIcon = 'pl-[2.25rem] pr-sm';
const paddingWithRightIcon = 'pl-sm pr-[2.25rem]';
const paddingWithBoth = 'pl-[2.25rem] pr-[2.25rem]';

const variantMap: Record<InputVariant, string> = {
  secondary: 'bg-transparent border border-2 border-[var(--color-secondary-600)] text-[var(--color-secondary-900)] placeholder:text-muted',
  glass: 'bg-primary-100/40 backdrop-blur-xl rounded-full text-primary-900 border-b border-primary-100 hover:bg-primary-600/30 hover:border-primary-900',
  default:
    'bg-neutral-900 border border-2 border-neutral-700 text-[var(--color-neutral-900)] placeholder:text-muted',
  ghost:
    'bg-transparent border border-neutral-700 text-[var(--color-neutral-900)] placeholder:text-muted',
};

export function getInputClasses(options: InputStyleOptions = {}) {
  const {
    variant = 'default',
    size = 'md',
    fullWidth = true,
    invalid = false,
    disabled = false,
    hasLeftIcon = false,
    hasRightIcon = false,
  } = options;

  const base: string[] = [
    'block',
    'w-full',
    sizeMap[size],
    'rounded-full',
    'font-body',
    'leading-normal',
    'outline-none',
    'transition',
    'duration-150',
    variantMap[variant],
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    'focus:ring-offset-neutral-900',
  ];

  if (!fullWidth) {
    base.splice(base.indexOf('w-full'), 1);
  }

  if (invalid) {
    base.push('border-red-400', 'focus:ring-red-400');
  }

  if (disabled) {
    base.push('opacity-60', 'cursor-not-allowed');
  }

  // Padding in base alla presenza icone
  if (hasLeftIcon && hasRightIcon) {
    base.push(paddingWithBoth);
  } else if (hasLeftIcon) {
    base.push(paddingWithLeftIcon);
  } else if (hasRightIcon) {
    base.push(paddingWithRightIcon);
  } else {
    base.push(paddingBase);
  }

  return {
    input: base.filter(Boolean).join(' '),
    wrapper: 'relative flex items-center',
    leftIcon: 'absolute left-3 text-muted flex items-center justify-center',
    rightIcon: 'absolute right-3 text-muted flex items-center justify-center',
  };
}
