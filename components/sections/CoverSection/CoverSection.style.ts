// components/sections/CoverSection/CoverSection.style.ts

export type CoverAlignX = 'left' | 'center' | 'right';
export type CoverAlignY = 'top' | 'center' | 'bottom';
export type CoverHeight = 'sm' | 'md' | 'lg' | 'full';
export type CoverContentVariant = 'plain' | 'card';

export interface CoverSectionStyleOptions {
  alignX?: CoverAlignX;
  alignY?: CoverAlignY;
  height?: CoverHeight;
  contentVariant?: CoverContentVariant;
}

const heightMap: Record<CoverHeight, string> = {
  sm: 'min-h-[50vh]',
  md: 'min-h-[65vh]',
  lg: 'min-h-[80vh]',
  full: 'min-h-screen',
};

const alignYMap: Record<CoverAlignY, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
};

const alignXMap: Record<CoverAlignX, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

export function getCoverSectionClasses(
  options: CoverSectionStyleOptions = {},
) {
  const {
    alignX = 'left',
    alignY = 'center',
    height = 'lg',
    contentVariant = 'plain',
  } = options;

  const wrapper: string[] = [
    'relative',
    'isolate',
    
    //'bg-neutral-950',
    'text-foreground',
  ];

  const background: string[] = [
    'absolute',
    'inset-0',
    '-z-10',
  ];

  const overlay: string[] = [
    'absolute',
    'inset-0',
    'bg-black',
    'opacity-70',
    
  ];

  const inner: string[] = [
    'relative',
    'flex',
    alignYMap[alignY],
    alignXMap[alignX],
    heightMap[height],
    //'px-6',
    'py-24',
  ];

  const content: string[] = [
    'max-w-xl',
    'w-full',
  ];

  if (contentVariant === 'plain') {
    content.push('space-y-md');
  }

  return {
    wrapper: wrapper.filter(Boolean).join(' '),
    background: background.filter(Boolean).join(' '),
    overlay: overlay.filter(Boolean).join(' '),
    inner: inner.filter(Boolean).join(' '),
    content: content.filter(Boolean).join(' '),
  };
}
