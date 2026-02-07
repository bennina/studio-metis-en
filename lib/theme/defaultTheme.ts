// lib/theme/defaultTheme.ts
// Default Metis Web Agency theme

import type { ThemeConfig } from './types';

export const defaultTheme: ThemeConfig = {
  name: 'metis-default',

  colors: {
    neutral: {
      100: '#f6f5f3',
      200: '#e6e4e1',
      300: '#d0cec9',
      400: '#b6b3ab',
      500: '#918d84',
      600: '#595750',
      700: '#32312c',
      800: '#20201d',
      900: '#151512',
    },
    primary: {
      100: '#F6E9EC',
      200: '#EBC8D0',
      300: '#DFA4B1',
      400: '#C96F82',
      500: '#A9445B', // Main brand color
      600: '#862F44',
      700: '#5F1F30',
      800: '#401522',
      900: '#2A0C15',
    },
    secondary: {
      100: '#E9EDF5',
      200: '#C9D3E6',
      300: '#A7B7D8',
      400: '#7390C0',
      500: '#436BA8', // Main secondary
      600: '#2E4E83',
      700: '#1F355B',
      800: '#14233D',
      900: '#0B1323',
    },
    accent: {
      100: '#E6FAF7',
      200: '#BFF2EA',
      300: '#8BE6D7',
      400: '#4ED4C0',
      500: '#1CBBA4', // Main accent
      600: '#0E927F',
      700: '#0B6D5F',
      800: '#07473E',
      900: '#042B26',
    },
    background: '#151512',
    surface: '#20201d',
    foreground: '#f6f5f3',
    muted: '#918d84',
    black: '#000000',
    white: '#ffffff',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '32px',
    xl: '64px',
  },

  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      sans: '"Barlow", sans-serif, system-ui',
      condensed: '"Barlow Condensed", sans-serif, system-ui',
      heading: '"Barlow", sans-serif, system-ui',
      body: '"Barlow", sans-serif, system-ui',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      h6: '18px',
      h5: '20px',
      h4: '24px',
      h3: '28px',
      h2: '36px',
      h1: '48px',
    },
    lineHeight: {
      heading: '1.1',
      body: '1.4',
    },
  },

  // Default component overrides (empty = use built-in styles)
  components: {},
};

/**
 * Create CSS variables from theme config
 * Used to generate :root styles
 */
export function generateCSSVariables(theme: ThemeConfig): string {
  const vars: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([colorName, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([shade, color]) => {
        vars.push(`  --color-${colorName}-${shade}: ${color};`);
      });
    } else {
      vars.push(`  --color-${colorName}: ${value};`);
    }
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([name, value]) => {
    vars.push(`  --spacing-${name}: ${value};`);
  });

  // Radius
  Object.entries(theme.radius).forEach(([name, value]) => {
    vars.push(`  --radius-${name}: ${value};`);
  });

  // Typography
  Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
    vars.push(`  --font-${name}: ${value};`);
  });
  Object.entries(theme.typography.fontSize).forEach(([name, value]) => {
    vars.push(`  --text-${name}: ${value};`);
  });
  Object.entries(theme.typography.lineHeight).forEach(([name, value]) => {
    vars.push(`  --line-height-${name}: ${value};`);
  });

  return `:root {\n${vars.join('\n')}\n}`;
}
