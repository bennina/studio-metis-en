// components/molecules/ContentBlock/ContentBlock.tsx
import type { FC, ReactNode } from "react";
import {
  Title,
  Paragraph,
  Button,
  type TitleTone,
  ButtonVariant,
} from "@/components/atoms";
import {
  getContentBlockClasses,
  type ContentBlockAlign,
} from "./ContentBlock.style";
import { AccordionDataItem, Accordions } from "../Accordion";

export interface ContentBlockColumn {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: string;
}

export interface ContentBlockProps {
  // ✅ nuove
  accordions?: AccordionDataItem[];
  accordionsTitle?: ReactNode;
  accordionsDefaultOpenKeys?: string[];

  isFirst?: Boolean;
  /** Occhiello (h4 / eyebrow) */
  eyebrow?: ReactNode;
  /** Titolo principale (h2) */
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Colonne descrittive (h3 + h5) */
  columns?: ContentBlockColumn[];

  /** Testo principale */
  body?: ReactNode;
  tone?: TitleTone;
  primaryCtaLabel?: ReactNode;
  primaryCtaHref?: string;
  /** CTA secondaria (testo bottone) */
  secondaryCtaLabel?: ReactNode;
  secondaryCtaHref?: string;
  /** Allineamento complessivo */
  align?: ContentBlockAlign;

  /** Callback opzionali per le CTA */
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;

  className?: string;
}

/**
 * ContentBlock
 *
 * Struttura:
 * - Eyebrow (h4) + Titolo (h2)
 * - Griglia 2 colonne: h3 descrittivo + h5 approfondimento
 * - Testo finale
 * - CTA primaria + secondaria
 *
 * È pensato per essere riusato:
 * - da solo come sezione testuale
 * - dentro Text+Media
 * - dentro Cover / Wall Card / Form Card come blocco di contenuto.
 */
export const ContentBlock: FC<ContentBlockProps> = ({
  eyebrow,
  title,
  columns,
  subtitle,
  body,
  isFirst,
  tone = "muted",
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  accordions,
  accordionsTitle,
  accordionsDefaultOpenKeys,
  align = "left",
  onPrimaryClick,
  onSecondaryClick,
  className = "",
}) => {
  const classes = getContentBlockClasses({ align });

  const hasActions = primaryCtaLabel || secondaryCtaLabel;

  let variantPrimaryCtaLabel: ButtonVariant = "ghost";
  let variantSecondaryCtaLabel: ButtonVariant = "ghost";
  switch (tone) {
    case "default":
      variantPrimaryCtaLabel = "glass";
      variantSecondaryCtaLabel = "outlinePrimary";
      break;
    case "muted":
      variantPrimaryCtaLabel = "glass";
      variantSecondaryCtaLabel = "outlinePrimary";
      break;
    case "white":
      variantPrimaryCtaLabel = "glass";
      variantSecondaryCtaLabel = "outlineLight";
      break;
    case "primary":
      variantPrimaryCtaLabel = "primary";
      variantSecondaryCtaLabel = "outlinePrimary";
      break;
    case "secondary":
      variantPrimaryCtaLabel = "secondary";
      variantSecondaryCtaLabel = "outlineSecondary";
      break;
    case "accent":
      variantPrimaryCtaLabel = "accent";
      variantSecondaryCtaLabel = "outlineAccent";
      break;
  }

  return (
    <div className={[classes.root, className].filter(Boolean).join(" ")}>
      {(eyebrow || title || subtitle) && (
        <header className={classes.header}>
          {eyebrow && (
            <Title tone={tone} variant="eyebrow" as="p">
              {eyebrow}
            </Title>
          )}
          {title && (
            <Title tone={tone} variant={isFirst ? "h1" : "h2"}>
              {title}
            </Title>
          )}
          {subtitle && (
            <Title tone={tone} variant="h3">
              {subtitle}
            </Title>
          )}
        </header>
      )}

      {columns && columns.length > 0 && (
        <div className={classes.columnsWrapper}>
          {columns.map((col, index) => (
            <div
              key={` ${eyebrow || title || subtitle} ${index}`}
              className={classes.column}
            >
              {col.title && (
                <Title variant="h4" as="h3">
                  {col.title}
                </Title>
              )}
              {col.subtitle && (
                <Title
                  variant="eyebrow"
                  as="h5"
                  tone={tone}
                  className="font-normal"
                >
                  {col.subtitle}
                </Title>
              )}
              {col.description && (
                <Paragraph tone={tone}>{col.description}</Paragraph>
              )}
            </div>
          ))}
        </div>
      )}

      {body && (
        <div className={classes.body}>
          {typeof body === "string" ? (
            <Paragraph tone={tone}>{body}</Paragraph>
          ) : (
            body
          )}
        </div>
      )}

      {(accordionsTitle || (accordions && accordions.length > 0)) && (
        <div className="mt-8">
          {accordionsTitle ? (
            <div className="mb-3 font-semibold">{accordionsTitle}</div>
          ) : null}

          <Accordions
            items={accordions ?? []}
            defaultExpandedKeys={accordionsDefaultOpenKeys}
            variant="splitted"
            selectionMode="multiple"
          />
        </div>
      )}

      {hasActions && (
        <div className={classes.actions}>
          {primaryCtaLabel && (
            <Button
              onClick={onPrimaryClick}
              href={primaryCtaHref}
              variant={variantPrimaryCtaLabel}
            >
              {primaryCtaLabel}
            </Button>
          )}
          {secondaryCtaLabel && (
            <Button
              href={secondaryCtaHref}
              variant={variantSecondaryCtaLabel}
              onClick={onSecondaryClick}
            >
              {secondaryCtaLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
