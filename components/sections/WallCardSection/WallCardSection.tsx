"use client"
// components/sections/WallCardSection/WallCardSection.tsx
import type { FC, ReactNode } from "react";
import {
  Section,
  Container,
  Title,
  Paragraph,
  Button,
  Image,
  TitleTone,
} from "@/components/atoms";
import {
  ContentBlock,
  Card,
  type ContentBlockProps,
  ContentBlockColumn,
  CardVariant,
} from "@/components/molecules";
import type {
  SectionPaddingY,
  SectionBackground,
} from "@/components/atoms/Section/Section.style";
import {
  getWallCardSectionClasses,
  type WallCardAlign,
  type WallCardColumnsMobile,
  type WallCardColumnsDesktop,
  type WallCardGap,
} from "./WallCardSection.style";

export interface Media {
  src: string;
  alt: string;
  /** opzionale: rapporto, se il tuo Image lo supporta (es. "4:3", "3:4") */
  ratio?: string;
}

export interface WallCardItem {
  id: string;
  eyebrow?: ReactNode;

  /** Titolo principale (h2) */
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Colonne descrittive (h3 + h5) */
  columns?: ContentBlockColumn[];

  /** Testo principale */
  body?: ReactNode;
  tone?: TitleTone;

  description?: ReactNode;
  icon?: ReactNode;

  meta?: {
    priceLabel?: string;
    priceValue?: string;
  };

  /** dati immagine */
  media?: Media;
  /** CTA interna alla card (opzionale) */
  ctaLabel?: ReactNode;
  ctaHref?: string;
}

export type WallCardCtaPlacement = "header" | "footer" | "both" | "none";

export interface WallCardSectionProps {
  id?: string;

  paddingY?: SectionPaddingY;
  background?: SectionBackground;

  /** Allineamento del blocco titolo/CTA e del footer: left | center */
  align?: WallCardAlign;

  /** Colonne mobile/desktop */
  columnsMobile?: WallCardColumnsMobile;
  columnsDesktop?: WallCardColumnsDesktop;
  cardVariant?: CardVariant;

  /** Spaziatura tra le card */
  gap?: WallCardGap;

  /** Header sopra le card (usa ContentBlock) */
  eyebrow?: ReactNode;

  tone?: TitleTone;
  title?: ReactNode;
  subtitle?: ReactNode;
  headerBody?: ReactNode;
  headerColumns?: ContentBlockProps["columns"];

  /** CTA globale */
  primaryCtaLabel?: ReactNode;
  primaryCtaHref?: string;
  secondaryCtaLabel?: ReactNode;
  secondaryCtaHref?: string;

  /** Dove posizionare la CTA globale */
  ctaPlacement?: WallCardCtaPlacement;

  /** Card da mostrare a muro */
  items: WallCardItem[];

  className?: string;
}

/**
 * WallCardSection
 *
 * - Header opzionale (eyebrow + title + testo) con CTA globale
 * - Griglia responsive di card (colonne diverse mobile/desktop)
 * - CTA globale posizionabile:
 *   - "header" → insieme al titolo
 *   - "footer" → sotto tutte le card
 *   - "both"   → in entrambi i posti
 *   - "none"   → nessuna CTA globale
 */
export const WallCardSection: FC<WallCardSectionProps> = ({
  id,
  paddingY = "xl",
  background = "default",
  align = "left",
  columnsMobile = 1,
  columnsDesktop = 3,
  gap = "md",
  eyebrow,
  title,
  tone,
  subtitle,
  headerBody,
  headerColumns,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  ctaPlacement = "header",
  items,
  cardVariant,
  className = "",
}) => {
  const classes = getWallCardSectionClasses({
    align,
    columnsMobile,
    columnsDesktop,
    gap,
  });

  const hasHeaderContent =
    eyebrow ||
    title ||
    headerBody ||
    (headerColumns && headerColumns.length > 0);

  const hasGlobalCta = primaryCtaLabel || secondaryCtaLabel;

  const showHeaderCta =
    hasGlobalCta && (ctaPlacement === "header" || ctaPlacement === "both");

  const showFooterCta =
    hasGlobalCta && (ctaPlacement === "footer" || ctaPlacement === "both");

  const isCenterAligned = align === "center";

  const primaryCtaClass =
    "inline-flex items-center justify-center rounded-full px-md py-[10px] text-sm font-medium bg-primary-500 text-neutral-950 hover:bg-primary-400 transition-colors w-full sm:w-auto";

  const secondaryCtaClass =
    "inline-flex items-center justify-center rounded-full px-md py-[10px] text-sm font-medium border border-neutral-700 text-foreground hover:bg-neutral-800 transition-colors w-full sm:w-auto";

  const cardCtaClass =
    "inline-flex items-center gap-1 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors";

  const renderGlobalCta = (position: "header" | "footer") => {
    if (position === "header" && !showHeaderCta) return null;
    if (position === "footer" && !showFooterCta) return null;

    return (
      <div className={position === "footer" ? classes.footer : ""}>
        <div className={classes.footerInner}>
          {primaryCtaLabel &&
            (primaryCtaHref ? (
              <Button href={primaryCtaHref}>{primaryCtaLabel}</Button>
            ) : (
              <Button type="button">{primaryCtaLabel}</Button>
            ))}

          {secondaryCtaLabel &&
            (secondaryCtaHref ? (
              <Button variant="outlineDark" href={secondaryCtaHref}>
                {secondaryCtaLabel}
              </Button>
            ) : (
              <Button variant="outlineDark" type="button">
                {secondaryCtaLabel}
              </Button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <Section
      id={id}
      paddingY={paddingY}
      background={background}
      className={className}
    >
      <Container>
        <div className={classes.inner}>
          {/* HEADER (titolo + testo + CTA globale opzionale) */}
          {(hasHeaderContent || showHeaderCta) && (
            <div
              className={[
                classes.header,
                isCenterAligned ? "flex flex-col items-center" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {hasHeaderContent && (
                <ContentBlock
                  align={align}
                  eyebrow={eyebrow}
                  title={title}
                  tone={tone}
                  subtitle={subtitle}
                  body={headerBody}
                  columns={headerColumns}
                />
              )}

              {renderGlobalCta("header")}
            </div>
          )}

          {/* GRID di card */}
          <div className={classes.grid}>
            {items.map((item, index) => (
              <Card
                key={`${item.id}-${index}-${id}`}
                variant={cardVariant || "primary"}
                padding="none"
                className={classes.card}
              >
                {typeof item?.media?.src !== "undefined" &&
                  item?.media?.src !== null && (
                    <Image
                      src={item?.media?.src}
                      alt={item?.media?.alt}
                      imageClassName="w-full aspect-square object-cover"
                      width={300}
                      height={200}
                    />
                  )}

                <div className="p-12 grid gap-6">
                  

                  {/* Icona */}
                  {item.icon && (
                    <div className="text-2xl mb-xs">{item.icon}</div>
                  )}

                  {/* Eyebrow */}
                  {item.eyebrow && (
                    <Title tone={"white"} variant="eyebrow" as="p">
                      {item.eyebrow}
                    </Title>
                  )}

                  {/* Titolo */}
                  <Title tone={"white"} variant="h3" as="h2">
                    {item.title}
                  </Title>

                  {/* Descrizione */}
                  {item.subtitle && (
                    <Title tone={"white"} variant="h5" as="h3">
                      {item.subtitle}
                    </Title>
                  )}
                  {/* Descrizione */}
                  {item.description && (
                    <Paragraph tone={"white"} size="sm">
                      {item.description}
                    </Paragraph>
                  )}

                    {/* Price */}
                  {item.meta?.priceValue && (
                    <Title tone={"white"} variant="h5" as="p">
                      {' <span class="text-md">' +item.meta?.priceLabel + ' </span><br><b>' + item.meta?.priceValue+ '</b>'}
                    </Title>
                    )}
                    
                  {/* CTA interna alla card */}
                  {item.ctaLabel && (
                    <div className="mt-5">
                      {item.ctaHref ? (
                        <Button variant="primary" href={item.ctaHref}>
                          {item.ctaLabel}
                        </Button>
                      ) : (
                        <Button variant="glass">{item.ctaLabel}</Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* CTA globale footer */}
          {renderGlobalCta("footer")}
        </div>
      </Container>
    </Section>
  );
};
