// components/molecules/PackageCard/PackageCard.tsx
import type { FC } from "react";
import type { Package } from "@/lib/packages/types";

export interface PackageCardProps {
  pkg: Package;
  variant?: "default" | "featured";
  className?: string;
}

export const PackageCard: FC<PackageCardProps> = ({
  pkg,
  variant = "default",
  className = "",
}) => {
  const isFeatured = variant === "featured" || pkg.highlighted;

  const packageUrl = `/pacchetti/${pkg.slug}`;

  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl",
        isFeatured
          ? "bg-primary-900 border-2 border-primary-500"
          : "bg-neutral-100 border border-neutral-200",
        "transition-all duration-300 hover:shadow-lg",
        isFeatured ? "hover:border-primary-400" : "hover:border-primary-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary-500 text-primary-900 rounded-full">
            {pkg.badge}
          </span>
        </div>
      )}

      {/* Link invisibile per tutta la card */}
      <a
        href={packageUrl}
        className="absolute inset-0 z-10"
        aria-label={`Scopri il pacchetto: ${pkg.title}`}
      />

      {/* Contenuto */}
      <div className="p-6 flex flex-col flex-1">
        {/* Target audience */}
        <span
          className={[
            "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider mb-2",
            isFeatured ? "text-primary-400" : "text-primary-600",
          ].join(" ")}
        >
          {pkg.targetAudience}
        </span>

        {/* Titolo */}
        <h3
          className={[
            "text-xl font-bold transition-colors",
            isFeatured
              ? "text-white group-hover:text-primary-300"
              : "text-primary-900 group-hover:text-primary-600",
          ].join(" ")}
        >
          {pkg.preview?.title || pkg.title}
        </h3>

        {/* Descrizione */}
        <p
          className={[
            "text-sm mt-3 line-clamp-3",
            isFeatured ? "text-neutral-300" : "text-primary-700",
          ].join(" ")}
        >
          {pkg.preview?.description || pkg.excerpt}
        </p>

        {/* Prezzo */}
        <div className="mt-auto pt-6">
          <div
            className={[
              "text-xs uppercase tracking-wider",
              isFeatured ? "text-neutral-400" : "text-primary-600",
            ].join(" ")}
          >
            {pkg.pricing.label}
          </div>
          <div
            className={[
              "text-2xl font-bold",
              isFeatured ? "text-white" : "text-primary-900",
            ].join(" ")}
          >
            {pkg.pricing.value}
          </div>
          {pkg.pricing.note && (
            <div
              className={[
                "text-sm mt-1",
                isFeatured ? "text-neutral-400" : "text-primary-600",
              ].join(" ")}
            >
              {pkg.pricing.note}
            </div>
          )}
        </div>

        {/* CTA */}
        {pkg.cta && (
          <div className="mt-4 pt-4 border-t border-neutral-200/20">
            <span
              className={[
                "text-sm font-medium",
                isFeatured
                  ? "text-primary-400 group-hover:text-primary-300"
                  : "text-primary-600 group-hover:text-primary-500",
              ].join(" ")}
            >
              {pkg.cta.label} →
            </span>
          </div>
        )}
      </div>
    </article>
  );
};
