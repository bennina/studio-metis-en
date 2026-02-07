// components/sections/WallCardSection/WallCardSection.style.ts

export type WallCardAlign = 'left' | 'center';
export type WallCardColumnsMobile = 1 | 2;
export type WallCardColumnsDesktop = 2 | 3 | 4;
export type WallCardGap = 'sm' | 'md' | 'lg';

export interface WallCardSectionStyleOptions {
  align?: WallCardAlign;
  columnsMobile?: WallCardColumnsMobile;
  columnsDesktop?: WallCardColumnsDesktop;
  gap?: WallCardGap;
}

const mobileColsMap: Record<WallCardColumnsMobile, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
};

const desktopColsMap: Record<WallCardColumnsDesktop, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

const gapMap: Record<WallCardGap, string> = {
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-12',
};

export function getWallCardSectionClasses(
  options: WallCardSectionStyleOptions = {}
) {
  const {
    align = 'left',
    columnsMobile = 1,
    columnsDesktop = 3,
    gap = 'md',
  } = options;

  const inner: string[] = ['space-y-24'];

  const header: string[] = ['space-y-12'];
  if (align === 'center') {
    header.push('text-center', 'items-center');
  }

  const grid: string[] = [
    'grid',
    mobileColsMap[columnsMobile],
    desktopColsMap[columnsDesktop],
    gapMap[gap],
  ];

  const card: string[] = [
    'h-full',
    'flex',
    'flex-col',
    'gap-6',
  ];

  const footer: string[] = [
    '',
  ];

  const footerInner: string[] = [
    'flex',
    'flex-col',
    'gap-6',
    'sm:flex-row',
    align === 'center' ? 'sm:justify-center sm:items-center' : 'sm:justify-start',
  ];

  return {
    inner: inner.filter(Boolean).join(' '),
    header: header.filter(Boolean).join(' '),
    grid: grid.filter(Boolean).join(' '),
    card: card.filter(Boolean).join(' '),
    footer: footer.filter(Boolean).join(' '),
    footerInner: footerInner.filter(Boolean).join(' '),
  };
}
