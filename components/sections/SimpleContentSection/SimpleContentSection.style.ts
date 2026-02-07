// components/sections/SimpleContentSection/SimpleContentSection.style.ts

export type SimpleContentWidth = 'narrow' | 'normal' | 'wide';

export interface SimpleContentSectionStyleOptions {
  width?: SimpleContentWidth;
}

const widthMap: Record<SimpleContentWidth, string> = {
  narrow: 'max-w-2xl mx-auto',
  normal: 'max-w-4xl mx-auto',
  wide: 'max-w-6xl mx-auto',
};

export function getSimpleContentSectionClasses(
  options: SimpleContentSectionStyleOptions = {}
) {
  const { width = 'normal' } = options;

  const inner: string[] = [widthMap[width], 'w-full'];

  return {
    inner: inner.filter(Boolean).join(' '),
  };
}
