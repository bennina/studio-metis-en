# Metis UI - Sistema di Theming

Guida completa al sistema di theming e personalizzazione di Metis UI.

## Indice

1. [Installazione](#installazione)
2. [Configurazione Base](#configurazione-base)
3. [Personalizzazione Tema](#personalizzazione-tema)
4. [Override Componenti](#override-componenti)
5. [Integrazione CMS](#integrazione-cms)
6. [Props di Stile via JSON](#props-di-stile-via-json)

---

## Installazione

```bash
# npm
npm install @metis-ui/core

# pnpm
pnpm add @metis-ui/core

# yarn
yarn add @metis-ui/core
```

### Peer Dependencies

```json
{
  "peerDependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

---

## Configurazione Base

### 1. Importa gli stili

```tsx
// app/layout.tsx
import '@metis-ui/core/styles.css';
```

### 2. Configura il ThemeProvider

```tsx
// app/layout.tsx
import { ThemeProvider } from '@metis-ui/core';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Personalizzazione Tema

### Override Colori

```tsx
import { ThemeProvider, type PartialThemeConfig } from '@metis-ui/core';

const customTheme: PartialThemeConfig = {
  name: 'my-brand',
  colors: {
    primary: {
      500: '#FF5733', // Colore principale
      600: '#E04D2D',
      // ... altri shade
    },
    secondary: {
      500: '#33FF57',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider theme={customTheme}>
      {children}
    </ThemeProvider>
  );
}
```

### Override Typography

```tsx
const customTheme: PartialThemeConfig = {
  typography: {
    fontFamily: {
      sans: '"Inter", sans-serif',
      heading: '"Poppins", sans-serif',
    },
    fontSize: {
      h1: '56px',
      h2: '42px',
    },
  },
};
```

### Override Spacing & Radius

```tsx
const customTheme: PartialThemeConfig = {
  spacing: {
    sm: '12px',
    md: '24px',
    lg: '48px',
  },
  radius: {
    md: '12px',
    lg: '24px',
  },
};
```

---

## Override Componenti

Puoi sovrascrivere le classi Tailwind per ogni variante di componente:

```tsx
const customTheme: PartialThemeConfig = {
  components: {
    Button: {
      // Classi base applicate a tutti i pulsanti
      base: 'font-bold tracking-wider',

      // Override varianti specifiche
      variants: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        // Aggiungi nuove varianti custom
        danger: 'bg-red-600 hover:bg-red-700 text-white',
      },

      // Override dimensioni
      sizes: {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
      },
    },

    Card: {
      variants: {
        elevated: 'shadow-xl border-0 bg-white',
        glass: 'backdrop-blur-xl bg-white/10 border border-white/20',
      },
      padding: {
        md: 'p-8',
        lg: 'p-12',
      },
    },

    Section: {
      backgrounds: {
        default: 'bg-white',
        primary: 'bg-gradient-to-br from-blue-600 to-purple-700',
        dark: 'bg-gray-900',
      },
    },
  },
};
```

---

## Integrazione CMS

### Payload CMS

```typescript
// collections/Pages.ts
import { CollectionConfig } from 'payload/types';

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        {
          slug: 'cover',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            {
              name: 'style',
              type: 'group',
              fields: [
                {
                  name: 'variant',
                  type: 'select',
                  options: ['default', 'glass', 'gradient'],
                },
                {
                  name: 'className',
                  type: 'text',
                  admin: { description: 'Classi Tailwind aggiuntive' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

### Strapi

```javascript
// api/page/content-types/page/schema.json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "attributes": {
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.cover",
        "sections.text-media",
        "sections.wall-card"
      ]
    }
  }
}

// components/sections/cover.json
{
  "collectionName": "components_sections_covers",
  "attributes": {
    "title": { "type": "string" },
    "variant": {
      "type": "enumeration",
      "enum": ["default", "glass", "gradient"]
    },
    "customClasses": {
      "type": "json",
      "description": "Override classi per root, content, etc."
    }
  }
}
```

---

## Props di Stile via JSON

Ogni sezione/componente supporta props per personalizzare lo stile:

```json
{
  "sections": [
    {
      "type": "cover",
      "content": {
        "title": "Benvenuto"
      },
      "style": {
        "variant": "glass",
        "className": "min-h-screen",
        "classNames": {
          "root": "relative overflow-hidden",
          "content": "max-w-4xl mx-auto",
          "title": "text-6xl font-black"
        }
      }
    }
  ]
}
```

### Mappatura Schema → Props

```typescript
// Aggiorna mapSchemaToConfig.ts
import { extractStyleProps } from '@metis-ui/core';

function mapCoverSection(section: CoverSectionSchema) {
  const styleProps = extractStyleProps(section.style || {});

  return {
    type: 'cover',
    props: {
      ...styleProps,
      title: section.content?.title,
      // ... altri props
    },
  };
}
```

### Uso nei Componenti

```tsx
// CoverSection.tsx
import { cn } from '@metis-ui/core';

export function CoverSection({
  title,
  className,
  classNames,
  variant = 'default',
}) {
  const styles = getCoverClasses({ variant });

  return (
    <section className={cn(styles.root, className, classNames?.root)}>
      <div className={cn(styles.content, classNames?.content)}>
        <h1 className={cn(styles.title, classNames?.title)}>
          {title}
        </h1>
      </div>
    </section>
  );
}
```

---

## Best Practices

### 1. Tema Centralizzato

Mantieni il tema in un file dedicato:

```typescript
// lib/theme/customTheme.ts
import { PartialThemeConfig } from '@metis-ui/core';

export const brandTheme: PartialThemeConfig = {
  name: 'my-brand',
  // ... configurazione
};
```

### 2. Varianti Semantiche

Usa nomi significativi per le varianti:

```typescript
components: {
  Button: {
    variants: {
      cta: 'bg-primary-500 text-white font-bold',
      subtle: 'bg-transparent text-primary-500',
      destructive: 'bg-red-600 text-white',
    },
  },
}
```

### 3. Responsive Design

Usa le utility responsive nelle classNames:

```json
{
  "classNames": {
    "root": "p-4 md:p-8 lg:p-12",
    "title": "text-2xl md:text-4xl lg:text-6xl"
  }
}
```

### 4. Design Tokens

Usa le CSS variables per consistenza:

```css
.my-custom-class {
  background: var(--color-primary-500);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

---

## API Reference

### ThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `PartialThemeConfig` | `defaultTheme` | Configurazione tema custom |
| `children` | `ReactNode` | - | Contenuto |

### useTheme Hook

```typescript
const {
  theme,                    // ThemeConfig completo
  getComponentOverrides,    // Ottieni override per componente
  mergeClasses,            // Unisci classi con override
} = useTheme();
```

### StyleProps Interface

```typescript
interface StyleProps {
  className?: string;
  variant?: string;
  size?: string;
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
```

---

## Migrazione da v1

Se stai migrando da una versione precedente:

1. Sposta i token CSS in `ThemeProvider`
2. Converti i `.style.ts` per usare `createStyleGetter`
3. Aggiungi support per `classNames` nei componenti
4. Aggiorna lo schema JSON per includere `style` props
