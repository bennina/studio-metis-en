// components/sections/TextMediaSection/TextMediaSection.style.ts

export type TextMediaPosition = 'left' | 'right';
export type TextMediaAlignY = 'top' | 'center' | 'bottom';
export type TextMediaWidth = 'narrow' | 'normal' | 'wide';

export interface TextMediaSectionStyleOptions {
  mediaPosition?: TextMediaPosition;
  textAlignY?: TextMediaAlignY;
  width?: TextMediaWidth;
}

const widthMap: Record<TextMediaWidth, string> = {
  narrow: 'max-w-2xl',
  normal: 'max-w-3xl',
  wide: 'max-w-5xl',
};

const textAlignMap: Record<TextMediaAlignY, string> = {
  top: 'justify-start',
  center: 'justify-center',
  bottom: 'justify-end',
};

export function getTextMediaSectionClasses(
  options: TextMediaSectionStyleOptions = {}
) {
  const {
    mediaPosition = 'right',
    textAlignY = 'top',
    width = 'normal',
  } = options;

  const grid: string[] = [
    'grid',
    'gap-12',
    'md:grid-cols-2',
    'items-stretch',
  ];

  const textWrapper: string[] = [
    'flex',
    'flex-col',
    textAlignMap[textAlignY],
    'py-12',        // respiro sopra e sotto
    'gap-6',
  ];

  const mediaWrapper: string[] = [
    'relative',
    'min-h-[400px]', // immagine almeno 400px
  ];

  // Ordine mobile/desktop
  // Mobile: image sopra (order-1), text sotto (order-2)
  // Desktop:
  //   - mediaPosition = left  → image left, text right
  //   - mediaPosition = right → text left, image right
  if (mediaPosition === 'left') {
    textWrapper.push('order-2');
    mediaWrapper.push('order-1');
  } else {
    textWrapper.push('order-2', 'md:order-1');
    mediaWrapper.push('order-1', 'md:order-2');
  }

  const textInner: string[] = [
    widthMap[width],
    'w-full',
  ];

  const mediaInner: string[] = [
    'relative',
    'w-full',
    'h-full',
    'min-h-[400px]',
    'overflow-hidden',
    'rounded-lg',
  ];

  return {
    grid: grid.filter(Boolean).join(' '),
    textWrapper: textWrapper.filter(Boolean).join(' '),
    mediaWrapper: mediaWrapper.filter(Boolean).join(' '),
    textInner: textInner.filter(Boolean).join(' '),
    mediaInner: mediaInner.filter(Boolean).join(' '),
  };
}
