// seo/SeoHead.tsx
import type { FC } from 'react';

interface SeoJsonLdProps {
  organizationName?: string;
  organizationUrl?: string;
  logoUrl?: string;
  sameAs?: string[];
}

export const SeoJsonLd: FC<SeoJsonLdProps> = ({
  organizationName,
  organizationUrl,
  logoUrl,
  sameAs,
}) => {
  if (!organizationName || !organizationUrl) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organizationName,
    url: organizationUrl,
    logo: logoUrl,
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
