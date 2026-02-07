"use client";
// components/sections/CoverSection/CoverSection.tsx
import type { FC, ReactNode } from "react";
import {
  Container,
  Image,
  Section,
  SectionPaddingY,
  SectionRounded,
  TitleTone,
} from "@/components/atoms";
import { Card, ContentBlock } from "@/components/molecules";
import {
  getCoverSectionClasses,
  type CoverAlignX,
  type CoverAlignY,
  type CoverHeight,
  type CoverContentVariant,
} from "./CoverSection.style";

export interface CoverBackgroundImage {
  src: string;
  alt: string;
}

export interface CoverSectionProps {
  /** Immagine di sfondo full-bleed */
  backgroundImage?: CoverBackgroundImage;

  background?: any;
  /** Overlay scuro sopra l'immagine (default: true) */
  withOverlay?: boolean;
  /** Classi extra per l’overlay (es. gradienti custom) */
  overlayClassName?: string;

  /** Allineamento del blocco contenuto sull’asse X */
  alignX?: CoverAlignX;
  /** Allineamento del blocco contenuto sull’asse Y */
  alignY?: CoverAlignY;
  
  radius?: SectionRounded;
  /** padding verticale della section (default: "xl") */
  paddingY?: SectionPaddingY;
  /** Altezza della cover */
  height?: CoverHeight;

  /** Contenuto “nudo” o dentro una card */
  contentVariant?: CoverContentVariant;
  
  tone?: TitleTone;

  /** Contenuto della cover (es. ContentBlock, titoli, CTA…) */
  children?: ReactNode;

  className?: string;
  id?: string;
}

/**
 * CoverSection
 *
 * Hero full-bleed con immagine di sfondo e blocco contenuto
 * posizionabile:
 * - orizzontale: left | center | right
 * - verticale: top | center | bottom
 *
 * Il contenuto può essere:
 * - plain (solo testo/ContentBlock)
 * - card (Card con sfondo scuro e blur)
 */
export const CoverSection: FC<CoverSectionProps> = ({
  backgroundImage,
  background,
  withOverlay = false,
  overlayClassName = "",
  alignX = "left",
  alignY = "center",
  radius,
  paddingY,
  height = "lg",
  contentVariant = "card",
  children,
  className = "",
  id,
  ...contentProps
}) => {
  const classes = getCoverSectionClasses({
    alignX,
    alignY,
    height,

    contentVariant,
  });
  const wrapperClassName = [classes.wrapper, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Section
      id={id}
      paddingY={paddingY}
      radius={radius}
      background={background}
      className={wrapperClassName}
    >
      {/* Background image + overlay */}
      <div className={classes.background}>
        {backgroundImage && (
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            fill
            priority
            sizes="100vw"
            objectFit="cover"
          />
        )}

        {withOverlay && (
          <div
            className={[classes.overlay, overlayClassName]
              .filter(Boolean)
              .join(" ")}
          />
        )}
      </div>

      {/* Content */}
      <Container paddingX="md">
        <div className={classes.inner}>
          <ContentBlock
            className="lg:max-w-[60%]"
            
            {...contentProps}
          />
          {children}
        </div>
      </Container>
    </Section>
  );
};
