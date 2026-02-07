// components/atoms/Textarea/Textarea.style.ts

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaStyleOptions {
  size?: TextareaSize;
  fullWidth?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}

const sizeMap: Record<TextareaSize, string> = {
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
};

export function getTextareaClasses(options: TextareaStyleOptions = {}) {
  const {
    size = 'md',
    fullWidth = true,
    invalid = false,
    disabled = false,
  } = options;

  const base: string[] = [
    'block',
    'w-full',
    sizeMap[size],
    'min-h-[120px]',
    'rounded-lg',
    'font-body',
    'leading-relaxed',
    
    'placeholder:text-muted',
    'px-sm',
    'py-[8px]',
    'outline-none',
    'transition',
    'duration-150',
    'focus:ring-2',
    'focus:ring-primary-900',
    'focus:ring-offset-2',
    'focus:ring-offset-[var(--color-neutral-900)]',
    'resize-y',
    'bg-primary-100/40 backdrop-blur-xl rounded-full text-primary-900 border-b border-primary-100 hover:bg-primary-600/30 hover:border-primary-900',
    
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

  return {
    textarea: base.filter(Boolean).join(' '),
  };
}
