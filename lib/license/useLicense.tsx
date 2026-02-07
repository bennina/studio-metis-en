// lib/license/useLicense.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  verifyLicense,
  hasFeature,
  type LicenseInfo,
  type LicenseConfig,
} from './index';

interface LicenseContextValue {
  license: LicenseInfo | null;
  isLoading: boolean;
  isValid: boolean;
  hasFeature: (feature: string) => boolean;
  isPremium: boolean;
}

const LicenseContext = createContext<LicenseContextValue | null>(null);

export interface LicenseProviderProps {
  children: ReactNode;
  config?: LicenseConfig;
  /** Fallback UI when license is invalid */
  fallback?: ReactNode;
  /** Show warning banner for trial/expired */
  showWarnings?: boolean;
}

export function LicenseProvider({
  children,
  config,
  fallback,
  showWarnings = true,
}: LicenseProviderProps) {
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyLicense(config)
      .then(setLicense)
      .finally(() => setIsLoading(false));
  }, [config]);

  const contextValue: LicenseContextValue = {
    license,
    isLoading,
    isValid: license?.valid ?? false,
    hasFeature: (feature: string) => license ? hasFeature(license, feature) : false,
    isPremium: license?.type !== 'trial',
  };

  // Show fallback if license is invalid and fallback is provided
  if (!isLoading && !license?.valid && fallback) {
    return <>{fallback}</>;
  }

  return (
    <LicenseContext.Provider value={contextValue}>
      {showWarnings && license && !license.valid && (
        <LicenseWarningBanner license={license} />
      )}
      {children}
    </LicenseContext.Provider>
  );
}

/**
 * Hook to access license information
 */
export function useLicense(): LicenseContextValue {
  const context = useContext(LicenseContext);

  if (!context) {
    // Return default values if no provider (development mode)
    return {
      license: null,
      isLoading: false,
      isValid: process.env.NODE_ENV === 'development',
      hasFeature: () => process.env.NODE_ENV === 'development',
      isPremium: false,
    };
  }

  return context;
}

/**
 * HOC to restrict component to licensed users
 */
export function withLicense<P extends object>(
  Component: React.ComponentType<P>,
  requiredFeature?: string
) {
  return function LicensedComponent(props: P) {
    const { isValid, hasFeature: checkFeature, isLoading } = useLicense();

    if (isLoading) {
      return null;
    }

    if (!isValid) {
      return (
        <div className="p-4 border border-yellow-500 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            This component requires a valid Metis UI license.
          </p>
          <a
            href="https://metiswebagency.it/pricing"
            className="text-yellow-600 underline"
          >
            Get a license
          </a>
        </div>
      );
    }

    if (requiredFeature && !checkFeature(requiredFeature)) {
      return (
        <div className="p-4 border border-blue-500 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            This component requires the &quot;{requiredFeature}&quot; feature.
            Upgrade your license to access it.
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Warning banner for trial/expired licenses
 */
function LicenseWarningBanner({ license }: { license: LicenseInfo }) {
  const isExpired = license.expiresAt && license.expiresAt < new Date();
  const daysLeft = license.expiresAt
    ? Math.ceil((license.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  if (license.valid && daysLeft && daysLeft > 7) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-3 text-center text-sm z-50 ${
        isExpired
          ? 'bg-red-600 text-white'
          : 'bg-yellow-500 text-yellow-900'
      }`}
    >
      {isExpired ? (
        <>
          Your Metis UI license has expired.{' '}
          <a href="https://metiswebagency.it/pricing" className="underline font-bold">
            Renew now
          </a>
        </>
      ) : license.type === 'trial' ? (
        <>
          You&apos;re using Metis UI trial. {daysLeft} days remaining.{' '}
          <a href="https://metiswebagency.it/pricing" className="underline font-bold">
            Get a license
          </a>
        </>
      ) : daysLeft && daysLeft <= 7 ? (
        <>
          Your license expires in {daysLeft} days.{' '}
          <a href="https://metiswebagency.it/pricing" className="underline font-bold">
            Renew now
          </a>
        </>
      ) : null}
    </div>
  );
}
