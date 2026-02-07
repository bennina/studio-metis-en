// components/sections/FooterSection/FooterSection.style.ts

export interface FooterSectionStyleOptions {
  hasTopArea?: boolean;
}

export function getFooterSectionClasses(
  options: FooterSectionStyleOptions = {}
) {
  const { hasTopArea = true } = options;

  const wrapper: string[] = [
    'mt-auto',
  ];

  const topArea: string[] = [
    'py-12',
    'px-6',
  ];

  const innerGrid: string[] = [
    'grid',
    'gap-6',
    'md:grid-cols-2',
  ];

  const companyBlock: string[] = [
    'space-y-2',
    'text-md',
    
    'grid',
 
    
  ];

  const companyName: string[] = [
    'text-md',
    'font-semibold',
    'tracking-[0.16em]',
    'uppercase',
    'text-[var(--color-neutral-600)]',
  ];

  const columnsGrid: string[] = [
    'grid',
    'gap-24',
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    'text-md',
  ];

  const columnTitle: string[] = [
    'text-3',
    'font-semibold',
    'tracking-[0.16em]',
    'uppercase',
    'text-[var(--color-neutral-600)]/80',
    'mb-2',
  ];

  const link: string[] = [
    'block',
    'py-0.5',
    
    'hover:text-[var(--color-secondary-600)]',
    'transition-colors',
    'duration-150',
    'text-md',
  ];

  const socialRow: string[] = [
    'flex',
    'flex-wrap',
    'gap-6',
    'mt-12',
    'items-center',
    'justify-center',
    'md:justify-end'
  ];

  const bottomBar: string[] = [
    'border-t',
    'border-neutral-800',
    'tracking-[1px]',
    'py-6',
    'px-6',
    'text-[12px]',
    'uppercase',
    
    'flex',
    'flex-col',
    'md:flex-row',
    'items-center',
    'justify-between',
    'gap-6',
  ];

  const bottomLinks: string[] = [
    'flex',
    'flex-wrap',
    'gap-6',
  ];

  return {
    wrapper: wrapper.filter(Boolean).join(' '),
    topArea: hasTopArea ? topArea.filter(Boolean).join(' ') : '',
    innerGrid: innerGrid.filter(Boolean).join(' '),
    companyBlock: companyBlock.filter(Boolean).join(' '),
    companyName: companyName.filter(Boolean).join(' '),
    columnsGrid: columnsGrid.filter(Boolean).join(' '),
    columnTitle: columnTitle.filter(Boolean).join(' '),
    link: link.filter(Boolean).join(' '),
    socialRow: socialRow.filter(Boolean).join(' '),
    bottomBar: bottomBar.filter(Boolean).join(' '),
    bottomLinks: bottomLinks.filter(Boolean).join(' '),
  };
}
