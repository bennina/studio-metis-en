// lib/theme/ThemeProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { defaultTheme } from './defaultTheme';
import type {
  ThemeConfig,
  PartialThemeConfig,
  ComponentVariantOverrides,
} from './types';

/**
 * Deep merge two objects (type-safe)
 */
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue as T[typeof key];
    }
  }

  return output;
}

/**
 * Theme context value
 */
interface ThemeContextValue {
  theme: ThemeConfig;

  getComponentOverrides: <
    K extends keyof ComponentVariantOverrides
  >(
    componentName: K
  ) => ComponentVariantOverrides[K] | undefined;

  mergeClasses: (
    defaultClasses: string,
    customClasses?: string
  ) => string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: PartialThemeConfig;
}

export function ThemeProvider({
  children,
  theme: customTheme,
}: ThemeProviderProps) {
  const mergedTheme = useMemo<ThemeConfig>(() => {
    if (!customTheme) return defaultTheme;
    return deepMerge(defaultTheme, customTheme as any);
  }, [customTheme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme: mergedTheme,

      getComponentOverrides: (componentName) =>
        mergedTheme.components?.[componentName],

      mergeClasses: (defaultClasses, customClasses) =>
        customClasses
          ? `${defaultClasses} ${customClasses}`.trim()
          : defaultClasses,
    }),
    [mergedTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      theme: defaultTheme,

      getComponentOverrides: (componentName) =>
        defaultTheme.components?.[componentName],

      mergeClasses: (defaultClasses, customClasses) =>
        customClasses
          ? `${defaultClasses} ${customClasses}`.trim()
          : defaultClasses,
    };
  }

  return context;
}

/**
 * Hook to get styles for a specific component with overrides
 */
export function useComponentStyles<
  TVariant extends string = string,
  TSize extends string = string
>(
  componentName: keyof ComponentVariantOverrides,
  options: {
    variant?: TVariant;
    size?: TSize;
    defaultClasses: string;
    variantMap?: Record<TVariant, string>;
    sizeMap?: Record<TSize, string>;
  }
): string {
  const { getComponentOverrides, mergeClasses } = useTheme();
  const overrides = getComponentOverrides(componentName);

  let classes = options.defaultClasses;

  // Base override
  if (overrides?.base) {
    classes = mergeClasses(classes, overrides.base);
  }

  // Variant override
  if (
    options.variant &&
    overrides?.variants &&
    options.variant in overrides.variants
  ) {
    classes = mergeClasses(
      classes,
      overrides.variants[options.variant as keyof typeof overrides.variants]
    );
  }

  // Size override
  if (
    options.size &&
    overrides?.sizes &&
    options.size in overrides.sizes
  ) {
    classes = mergeClasses(
      classes,
      overrides.sizes[options.size as keyof typeof overrides.sizes]
    );
  }

  return classes;
}
