// components/molecules/ContentBlock/ContentBlock.style.ts

export type ContentBlockAlign = 'left' | 'center';

export interface ContentBlockStyleOptions {
  align?: ContentBlockAlign;
}

export function getContentBlockClasses(options: ContentBlockStyleOptions = {}) {
  const { align = 'left' } = options;

  const root: string[] = ['flex', 'flex-col', 'gap-6'];

  const header: string[] = ['flex', 'flex-col', 'gap-3'];

  const columnsWrapper: string[] = [
    'grid',
    'gap-6',
    'md:grid-cols-2',
  ];

  const column: string[] = ['flex', 'flex-col', 'gap-6'];

  const body: string[] = [''];

  const actions: string[] = [
    'flex',
    'flex-wrap',
    'gap-6',
  ];

  if (align === 'center') {
    root.push('items-center', 'text-center');
    body.push('mx-auto');
    actions.push('justify-center');
  }

  return {
    root: root.filter(Boolean).join(' '),
    header: header.filter(Boolean).join(' '),
    columnsWrapper: columnsWrapper.filter(Boolean).join(' '),
    column: column.filter(Boolean).join(' '),
    body: body.filter(Boolean).join(' '),
    actions: actions.filter(Boolean).join(' '),
  };
}
