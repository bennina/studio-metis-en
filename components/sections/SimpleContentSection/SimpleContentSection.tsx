"use client";
// components/sections/SimpleContentSection/SimpleContentSection.tsx
import type { FC, ReactNode } from "react";
import { Section, Container } from "@/components/atoms";
import { ContentBlock, type ContentBlockProps } from "@/components/molecules";
import type {
  SectionPaddingY,
  SectionBackground,
} from "@/components/atoms/Section/Section.style";
import {
  getSimpleContentSectionClasses,
  type SimpleContentWidth,
} from "./SimpleContentSection.style";

export interface SimpleContentSectionProps
  extends Omit<ContentBlockProps, "align"> {
  /** id della <section> per anchor/link */
  id?: string;

  /** padding verticale della section (default: "xl") */
  paddingY?: SectionPaddingY;

  /** background della section (default: "default") */
  background?: SectionBackground;

  /** larghezza massima del blocco testo */
  width?: SimpleContentWidth;

  /** allineamento del ContentBlock: left | center */
  align?: ContentBlockProps["align"];

  /** CTA globale */
  primaryCtaLabel?: ReactNode;
  primaryCtaHref?: string;
  secondaryCtaLabel?: ReactNode;
  secondaryCtaHref?: string;

  className?: string;
}

/**
 * SimpleContentSection
 *
 * Wrapper per ContentBlock dentro Section + Container.
 * Usa:
 * - Section → padding/background (SEO-friendly <section>)
 * - Container → larghezza pagina
 * - ContentBlock → struttura testo (eyebrow, title, columns, body, CTA)
 */
export const SimpleContentSection: FC<SimpleContentSectionProps> = ({
  id,
  paddingY = 'xl',
  background = "default",
  width = "normal",
  align = "left",
  className = "",
  ...contentProps
}) => {
  const classes = getSimpleContentSectionClasses({ width });
  
  return (
    <Section
      id={id}
      paddingY={paddingY}
      background={background}
      className={className}
      
    >
      <Container>
          <ContentBlock align={align} {...contentProps} />
      </Container>
    </Section>
  );
};
