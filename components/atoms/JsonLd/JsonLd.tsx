// components/atoms/JsonLd/JsonLd.tsx
import type { FC } from "react";

export interface JsonLdProps {
  data: object | object[];
}

/**
 * JsonLd - Renders JSON-LD structured data
 *
 * @example
 * <JsonLd data={getOrganizationSchema()} />
 * <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
 */
export const JsonLd: FC<JsonLdProps> = ({ data }) => {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};
