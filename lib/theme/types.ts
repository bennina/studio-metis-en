// lib/theme/types.ts
// Theme type definitions for the Metis UI system

/**
 * Color palette structure
 */
export interface ColorScale {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeColors {
  neutral: ColorScale;
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  // Semantic colors
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  black: string;
  white: string;
}

/**
 * Spacing tokens
 */
export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Border radius tokens
 */
export interface ThemeRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Typography tokens
 */
export interface ThemeTypography {
  fontFamily: {
    sans: string;
    condensed: string;
    heading: string;
    body: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    h6: string;
    h5: string;
    h4: string;
    h3: string;
    h2: string;
    h1: string;
  };
  lineHeight: {
    heading: string;
    body: string;
  };
}

/**
 * Component variant overrides
 * Allows customizing Tailwind classes for each component variant
 */
export interface ComponentVariantOverrides {
  Button?: {
    variants?: Partial<Record<string, string>>;
    sizes?: Partial<Record<string, string>>;
    base?: string;
  };
  Card?: {
    variants?: Partial<Record<string, string>>;
    padding?: Partial<Record<string, string>>;
    base?: string;
  };
  Input?: {
    variants?: Partial<Record<string, string>>;
    sizes?: Partial<Record<string, string>>;
    base?: string;
  };
  Section?: {
    backgrounds?: Partial<Record<string, string>>;
    paddingY?: Partial<Record<string, string>>;
    base?: string;
  };
  // Add more components as needed
  [key: string]: {
    variants?: Partial<Record<string, string>>;
    sizes?: Partial<Record<string, string>>;
    padding?: Partial<Record<string, string>>;
    backgrounds?: Partial<Record<string, string>>;
    base?: string;
  } | undefined;
}

/**
 * Full theme configuration
 */
export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
  components?: ComponentVariantOverrides;
}

/**
 * Partial theme for overrides
 */
export type PartialThemeConfig = {
  name?: string;
  colors?: Partial<ThemeColors>;
  spacing?: Partial<ThemeSpacing>;
  radius?: Partial<ThemeRadius>;
  typography?: Partial<ThemeTypography>;
  components?: ComponentVariantOverrides;
};

/**
 * Props that can be passed via JSON to customize component styling
 */
export interface StyleProps {
  className?: string;
  variant?: string;
  size?: string;
  // Custom class overrides for specific parts
  classNames?: {
    root?: string;
    container?: string;
    content?: string;
    header?: string;
    body?: string;
    footer?: string;
    [key: string]: string | undefined;
  };
}
