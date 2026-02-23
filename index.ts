// index.ts
// athometis - Main entry point

// Theme system
export * from './lib/theme';


// Componenti e layout principali
export * from './components';

// Tipi/layout di alto livello
export type {
  PageWrapperProps,
  PageSectionConfig,
} from './components/layout/PageWrapper';

// Schema per i contenuti JSON-based
export * from './schema/pageSchema';
export * from './schema/mapSchemaToConfig';
