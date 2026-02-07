// index.ts
// @metis-ui/core - Main entry point

// Theme system
export * from './lib/theme';

// License system
export * from './lib/license';
export { LicenseProvider, useLicense, withLicense } from './lib/license/useLicense';

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
