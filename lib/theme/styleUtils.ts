// lib/theme/styleUtils.ts
// Utility functions for style management

import type { StyleProps } from './types';

/**
 * Merge multiple class strings, filtering out undefined/null/false values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create a class name getter that supports overrides from JSON props
 * `root` is guaranteed to exist
 */
export function createStyleGetter<
  TOptions extends Record<string, unknown>,
  TSlots extends string = never
>(
  getDefaultClasses: (
    options: TOptions
  ) => Record<TSlots | 'root', string>
) {
  return (
    options: TOptions,
    styleProps?: StyleProps
  ): Record<TSlots | 'root', string> => {
    const defaultClasses = getDefaultClasses(options);

    // No slot overrides → only merge root className
    if (!styleProps?.classNames) {
      // Just merge the root className if provided
      if (styleProps?.className && 'root' in defaultClasses) {
        return {
          ...defaultClasses,
          root: cn((defaultClasses as Record<string, string>).root, styleProps.className),
        } as Record<TSlots | 'root', string>;
      }
      return defaultClasses;
    }

    const merged: Record<TSlots | 'root', string> = {
      ...defaultClasses,
    };

    for (const slot of Object.keys(defaultClasses) as Array<TSlots | 'root'>) {
      merged[slot] = cn(
        defaultClasses[slot],
        styleProps.classNames?.[slot]
      );
    }

    // Also apply root className override
    if (styleProps.className && 'root' in merged) {
      merged.root = cn(merged.root, styleProps.className);
    }

    return merged;
  };
}

/**
 * Extract style props from JSON schema props
 * Use this when mapping JSON to component props
 */
export function extractStyleProps(props: Record<string, unknown>): StyleProps {
  return {
    className: props.className as string | undefined,
    variant: props.variant as string | undefined,
    size: props.size as string | undefined,
    classNames: props.classNames as StyleProps['classNames'],
  };
}

/**
 * Create variant map with override support
 * Allows adding custom variants at runtime from JSON/CMS
 */
export function createVariantMap<T extends string>(
  defaultVariants: Record<T, string>,
  customVariants?: Partial<Record<string, string>>
): Record<string, string> {
  if (!customVariants) return defaultVariants;
  return { ...defaultVariants, ...customVariants };
}

/**
 * Conditional class application
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass?: string
): string {
  return condition ? trueClass : falseClass ?? '';
}

/**
 * Create responsive class string
 * Example:
 * responsiveClasses('p', { base: '4', md: '6', lg: '8' })
 * => 'p-4 md:p-6 lg:p-8'
 */
export function responsiveClasses(
  prefix: string,
  values: {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  }
): string {
  const classes: string[] = [];

  if (values.base) classes.push(`${prefix}-${values.base}`);
  if (values.sm) classes.push(`sm:${prefix}-${values.sm}`);
  if (values.md) classes.push(`md:${prefix}-${values.md}`);
  if (values.lg) classes.push(`lg:${prefix}-${values.lg}`);
  if (values.xl) classes.push(`xl:${prefix}-${values.xl}`);
  if (values['2xl']) classes.push(`2xl:${prefix}-${values['2xl']}`);

  return classes.join(' ');
}
