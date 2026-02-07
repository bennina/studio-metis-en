// components/molecules/ServiceCard/ServiceCard.tsx
import type { FC } from "react";
import type { ServiceWithCategory } from "@/lib/services/types";

export interface ServiceCardProps {
  service: ServiceWithCategory;
  variant?: "default" | "compact";
  className?: string;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  service,
  variant = "default",
  className = "",
}) => {
  const isCompact = variant === "compact";

  const serviceUrl = `/servizi/${service.slug}`;

  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "bg-neutral-100 border border-neutral-200",
        "transition-all duration-300 hover:shadow-lg hover:border-primary-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Link invisibile per tutta la card */}
      <a
        href={serviceUrl}
        className="absolute inset-0 z-10"
        aria-label={`Scopri il servizio: ${service.title}`}
      />

      {/* Contenuto */}
      <div className={isCompact ? "p-4" : "p-6"}>
        {/* Categoria */}
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
          {service.categoryData.name}
        </span>

        {/* Titolo */}
        <h3
          className={[
            "font-bold text-primary-900 group-hover:text-primary-600 transition-colors",
            isCompact ? "text-base" : "text-lg",
          ].join(" ")}
        >
          {service.preview?.title || service.title}
        </h3>

        {/* Descrizione */}
        <p
          className={[
            "text-primary-700 mt-2",
            isCompact ? "text-sm line-clamp-2" : "text-sm line-clamp-3",
          ].join(" ")}
        >
          {service.preview?.description || service.excerpt}
        </p>

        {/* CTA */}
        {service.cta && !isCompact && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <span className="text-sm font-medium text-primary-600 group-hover:text-primary-500">
              {service.cta.label} →
            </span>
          </div>
        )}
      </div>
    </article>
  );
};
