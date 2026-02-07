"use client";
// components/sections/TextMediaSection/TextMediaSection.tsx
import type { FC, ReactNode } from 'react';
import { Section, Container, Image } from "@/components/atoms";
import { ContentBlock, type ContentBlockProps } from "@/components/molecules";
import type {
  SectionPaddingY,
  SectionBackground,
} from '@/components/atoms/Section/Section.style';
import {
  getTextMediaSectionClasses,
  type TextMediaPosition,
  type TextMediaAlignY,
  type TextMediaWidth,
} from './TextMediaSection.style';

export interface TextMediaImage {
  src: string;
  alt: string;
  /** opzionale: rapporto, se il tuo Image lo supporta (es. "4:3", "3:4") */
  ratio?: string;
}

export interface TextMediaSectionProps
  extends Omit<ContentBlockProps, 'align'> {
  id?: string;

  /** padding verticale della section */
  paddingY?: SectionPaddingY;

  /** background della section */
  background?: SectionBackground;

  /** larghezza massima del blocco testo */
  width?: TextMediaWidth;

  /** allineamento verticale del testo: top (normale), center, bottom */
  textAlignY?: TextMediaAlignY;

  /** posizione dell’immagine da desktop */
  mediaPosition?: TextMediaPosition;

  /** dati immagine */
  media: TextMediaImage;

  /** se vuoi allineare il testo al centro orizzontale (per text-align) */
  alignText?: 'left' | 'center';

  /** CTA globale */
  primaryCtaLabel?: ReactNode;
  primaryCtaHref?: string;
  secondaryCtaLabel?: ReactNode;
  secondaryCtaHref?: string;
  
  className?: string;
}

/**
 * TextMediaSection
 *
 * Mobile:
 *  - immagine SEMPRE sopra, testo sotto
 *
 * Desktop:
 *  - mediaPosition: "left" → immagine a sinistra, testo a destra
 *  - mediaPosition: "right" → testo a sinistra, immagine a destra
 *
 * Testo:
 *  - vertical alignment: top | center | bottom
 *  - con padding verticale interno (py-lg) per dare respiro
 *
 * Immagine:
 *  - min-height: 400px
 *  - si estende in altezza quanto il contenuto quando possibile
 */
export const TextMediaSection: FC<TextMediaSectionProps> = ({
  id,
  paddingY = 'xl',
  background = 'default',
  width = 'normal',
  textAlignY = 'top',
  mediaPosition = 'right',
  media,
  alignText = 'left',
  className = '',
  ...contentProps
}) => {
  const classes = getTextMediaSectionClasses({
    mediaPosition,
    textAlignY,
    width,
  });

  return (
    <Section
      id={id}
      paddingY={paddingY}
      background={background}
      className={className}
    >
      <Container>
        <div className={classes.grid}>
          {/* Testo */}
          <div className={classes.textWrapper}>
            <div
              className={[
                classes.textInner,
                alignText === 'center' ? 'text-center mx-auto' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <ContentBlock
                align={alignText === 'center' ? 'center' : 'left'}
                {...contentProps}
              />
            </div>
          </div>

          {/* Immagine */}
          <div className={classes.mediaWrapper}>
            <div className={classes.mediaInner}>
              <Image
                src={media.src}
                alt={media.alt}
                fill
                objectFit="cover"
                //ratio={media.ratio ? '4:3' : undefined}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
