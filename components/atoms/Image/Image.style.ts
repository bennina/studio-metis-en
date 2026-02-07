// components/atoms/Image/Image.style.ts

export type ImageRatio = 'auto' | '1:1' | '4:3' | '3:2' | '16:9';
export type ImageVariant = 'default' | 'rounded' | 'circle';
export type ImageObjectFit = 'cover' | 'contain';

export interface ImageStyleOptions {
  ratio?: ImageRatio;
  variant?: ImageVariant;
  objectFit?: ImageObjectFit;
  shadow?: boolean;
  withBorder?: boolean;
}

const ratioMap: Record<Exclude<ImageRatio, 'auto'>, string> = {
  '1:1': 'aspect-[1/1]',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '16:9': 'aspect-[16/9]',
};

export function getImageClasses(options: ImageStyleOptions = {}) {
  const {
    ratio = 'auto',
    variant = 'default',
    objectFit = 'cover',
    shadow = false,
    withBorder = false,
  } = options;

  const wrapperBase: string[] = ['relative', 'size-full', 'overflow-hidden'];

  if (ratio !== 'auto') {
    wrapperBase.push('w-full', ratioMap[ratio]);
  }

  const imageBase: string[] = ['object-center'];

  if (objectFit === 'cover') imageBase.push('object-cover');
  if (objectFit === 'contain') imageBase.push('object-contain');

  if (variant === 'rounded') imageBase.push('rounded-lg');
  if (variant === 'circle') imageBase.push('rounded-full');

  if (shadow) imageBase.push('shadow-md', 'shadow-black/20');
  if (withBorder) imageBase.push('border', 'border-neutral-800');

  return {
    wrapper: wrapperBase.filter(Boolean).join(' '),
    image: imageBase.filter(Boolean).join(' '),
  };
}
