// lib/theme/index.ts
// Theme system exports

// Types
export type {
  ThemeConfig,
  PartialThemeConfig,
  ThemeColors,
  ThemeSpacing,
  ThemeRadius,
  ThemeTypography,
  ColorScale,
  ComponentVariantOverrides,
  StyleProps,
} from './types';

// Default theme
export { defaultTheme, generateCSSVariables } from './defaultTheme';

// Theme provider and hooks
export {
  ThemeProvider,
  useTheme,
  useComponentStyles,
  type ThemeProviderProps,
} from './ThemeProvider';

// Style utilities
export {
  cn,
  createStyleGetter,
  extractStyleProps,
  createVariantMap,
  conditionalClass,
  responsiveClasses,
} from './styleUtils';
