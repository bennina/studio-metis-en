// lib/license/index.ts
// License verification system for Metis UI

export type LicenseType = 'personal' | 'team' | 'agency' | 'enterprise' | 'trial';

export interface LicenseInfo {
  valid: boolean;
  type: LicenseType;
  expiresAt: Date | null;
  owner: string;
  maxProjects: number;
  maxDevelopers: number;
  features: string[];
}

export interface LicenseConfig {
  licenseKey?: string;
  /** Skip license check in development */
  skipInDev?: boolean;
  /** Custom API endpoint for license validation */
  apiEndpoint?: string;
}

const LICENSE_API = 'https://api.metiswebagency.it/v1/license/verify';

/**
 * Decode and parse license key (JWT-like structure)
 */
function decodeLicenseKey(key: string): Partial<LicenseInfo> | null {
  try {
    // License key format: base64(JSON)_signature
    const [payload] = key.split('_');
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Verify license with remote API
 */
async function verifyWithAPI(
  key: string,
  endpoint: string = LICENSE_API
): Promise<LicenseInfo> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: key }),
    });

    if (!response.ok) {
      throw new Error('License verification failed');
    }

    return await response.json();
  } catch (error) {
    console.warn('[Metis UI] License API unreachable, using offline verification');
    return offlineVerify(key);
  }
}

/**
 * Offline verification (fallback)
 */
function offlineVerify(key: string): LicenseInfo {
  const decoded = decodeLicenseKey(key);

  if (!decoded) {
    return {
      valid: false,
      type: 'trial',
      expiresAt: null,
      owner: 'Unknown',
      maxProjects: 0,
      maxDevelopers: 0,
      features: [],
    };
  }

  const expiresAt = decoded.expiresAt ? new Date(decoded.expiresAt) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;

  return {
    valid: !isExpired && !!decoded.type,
    type: decoded.type || 'trial',
    expiresAt,
    owner: decoded.owner || 'Unknown',
    maxProjects: decoded.maxProjects || 1,
    maxDevelopers: decoded.maxDevelopers || 1,
    features: decoded.features || [],
  };
}

/**
 * Main license verification function
 */
export async function verifyLicense(config: LicenseConfig = {}): Promise<LicenseInfo> {
  const {
    licenseKey = process.env.METIS_UI_LICENSE_KEY,
    skipInDev = true,
    apiEndpoint,
  } = config;

  // Skip in development if configured
  if (skipInDev && process.env.NODE_ENV === 'development') {
    return {
      valid: true,
      type: 'trial',
      expiresAt: null,
      owner: 'Development',
      maxProjects: Infinity,
      maxDevelopers: Infinity,
      features: ['*'],
    };
  }

  // No license key provided
  if (!licenseKey) {
    console.warn('[Metis UI] No license key provided. Some features may be disabled.');
    return {
      valid: false,
      type: 'trial',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
      owner: 'Trial User',
      maxProjects: 1,
      maxDevelopers: 1,
      features: ['basic'],
    };
  }

  // Verify license
  return verifyWithAPI(licenseKey, apiEndpoint);
}

/**
 * Check if a specific feature is available
 */
export function hasFeature(license: LicenseInfo, feature: string): boolean {
  if (!license.valid) return false;
  if (license.features.includes('*')) return true;
  return license.features.includes(feature);
}

/**
 * Generate a license key (for internal use / admin panel)
 */
export function generateLicenseKey(info: Omit<LicenseInfo, 'valid'>): string {
  const payload = Buffer.from(JSON.stringify(info)).toString('base64');
  // In production, add proper cryptographic signature
  const signature = Buffer.from(`metis_${Date.now()}`).toString('base64');
  return `${payload}_${signature}`;
}

// License tiers configuration
export const LICENSE_TIERS = {
  personal: {
    name: 'Personal',
    price: 99,
    currency: 'EUR',
    period: 'year',
    maxProjects: 1,
    maxDevelopers: 1,
    features: ['basic', 'atoms', 'molecules', 'sections'],
  },
  team: {
    name: 'Team',
    price: 299,
    currency: 'EUR',
    period: 'year',
    maxProjects: Infinity,
    maxDevelopers: 10,
    features: ['basic', 'atoms', 'molecules', 'sections', 'theme-builder', 'priority-support'],
  },
  agency: {
    name: 'Agency',
    price: 599,
    currency: 'EUR',
    period: 'year',
    maxProjects: Infinity,
    maxDevelopers: Infinity,
    features: ['*'],
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // Custom pricing
    currency: 'EUR',
    period: 'year',
    maxProjects: Infinity,
    maxDevelopers: Infinity,
    features: ['*', 'sla', 'source-code', 'custom-components'],
  },
} as const;
