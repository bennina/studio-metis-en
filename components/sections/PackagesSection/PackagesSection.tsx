// components/sections/PackagesSection/PackagesSection.tsx
import type { FC } from "react";
import { Section, Container, Button } from "@/components/atoms";
import { PackageCard } from "@/components/molecules/PackageCard";
import type {
  SectionPaddingY,
  SectionBackground,
} from "@/components/atoms/Section/Section.style";
import type { Package, PackagesSectionConfig } from "@/lib/packages/types";

export interface PackagesSectionProps extends PackagesSectionConfig {
  id?: string;
  paddingY?: SectionPaddingY;
  background?: SectionBackground;
  align?: "left" | "center";
  className?: string;
  /** Pacchetti da mostrare (passati dal server) */
  packages?: Package[];
}

/**
 * PackagesSection
 *
 * Sezione dinamica che mostra i pacchetti in griglia.
 * Riceve i dati già fetchati dal server (per RSC).
 */
export const PackagesSection: FC<PackagesSectionProps> = ({
  id,
  mode = "grid",
  title,
  subtitle,
  columns = 3,
  showViewAll = false,
  viewAllUrl = "/pacchetti",
  paddingY = "lg",
  background = "default",
  align = "left",
  className = "",
  packages = [],
}) => {
  const columnsMap: Record<number, string> = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  const hasContent = packages.length > 0;

  return (
    <Section
      id={id}
      paddingY={paddingY}
      background={background}
      className={className}
    >
      <Container>
        <div className="flex flex-col gap-12">
          {/* Header */}
          {(title || subtitle) && (
            <header
              className={[
                "flex flex-col gap-4 max-w-3xl",
                align === "center" ? "items-center text-center mx-auto" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-primary-900">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-lg text-primary-700">{subtitle}</p>}
            </header>
          )}

          {/* Grid */}
          {hasContent ? (
            <div
              className={[
                "grid grid-cols-1 gap-6 lg:gap-8",
                columnsMap[columns] || columnsMap[3],
              ].join(" ")}
            >
              {packages.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-primary-600">Nessun pacchetto disponibile.</p>
            </div>
          )}

          {/* Footer con "Vedi tutti" */}
          {showViewAll && hasContent && (
            <div
              className={[
                "flex pt-4",
                align === "center" ? "justify-center" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Button variant="outlinePrimary" href={viewAllUrl}>
                Vedi tutti i pacchetti
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};
