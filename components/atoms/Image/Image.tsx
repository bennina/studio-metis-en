// components/atoms/Image/Image.tsx
import type { FC } from 'react';
import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import {
  getImageClasses,
  type ImageRatio,
  type ImageVariant,
  type ImageObjectFit,
} from './Image.style';

export interface ImageProps
  extends Omit<NextImageProps, 'className' | 'fill'> {
  /** Classi aggiuntive per il wrapper esterno */
  wrapperClassName?: string;
  /** Classi aggiuntive per l'immagine interna */
  imageClassName?: string;

  /** Ratio del wrapper (usa NextImage con fill) */
  ratio?: ImageRatio;
  variant?: ImageVariant;
  objectFit?: ImageObjectFit;
  shadow?: boolean;
  withBorder?: boolean;

  /** Usa NextImage con fill (richiede ratio o altezza del wrapper) */
  fill?: boolean;
}

/**
 * Image
 *
 * - Usa sempre next/image per ottimizzazione
 * - Se `fill` è true → wrapper relativo + ratio/altezza fissa
 * - Se `fill` è false → usa width/height passati come da NextImage
 */
export const Image: FC<ImageProps> = ({
  wrapperClassName = '',
  imageClassName = '',
  ratio = 'auto',
  variant = 'default',
  objectFit = 'cover',
  shadow = false,
  withBorder = false,
  fill = false,
  alt,
  ...rest
}) => {
  const classes = getImageClasses({
    ratio,
    variant,
    objectFit,
    shadow,
    withBorder,
  });

  // Se usiamo fill, NextImage deve essere absolutely positioned nel wrapper
  const imagePositioning = fill
    ? 'absolute inset-0'
    : ratio !== 'auto'
    ? 'w-full h-full'
    : '';

  return (
    <div
      className={[classes.wrapper, wrapperClassName]
        .filter(Boolean)
        .join(' ')}
    >
      <NextImage
        alt={alt}
        {...(fill ? { fill: true } : {})}
        {...rest}
        className={[classes.image, imagePositioning, imageClassName]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  );
};
