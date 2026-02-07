// components/sections/FormCardSection/FormCardSection.style.ts

export function getFormCardSectionClasses() {
  const form: string[] = ['space-y-md', 'md:col-span-2'];
  const header: string[] = ['space-y-2'];
  const title: string[] = [];
  const description: string[] = ['text-md',];
  const card: string[] = ['p-12', 'rounded-xl', 'space-y-6'];
   const checkbox: string[] = ['text-primary-100'];
  const fields: string[] = ['px-6', 'b-2'];
  const textarea: string[] = [''];
  const footer: string[] = [
    'pt-6',
    'grid',
    'md:grid-cols-3',
    'gap-6',
    'sm:flex-row',
    'sm:items-center',
    'sm:justify-between',
  ];
  const content: string[] = ['grid', 'md:grid-cols-3', 'gap-6', 'items-center', 'z-11 relative'];
  const formFields: string[] = ['w-full', 'mb-6'];
 
  const secondaryText: string[] = ['text-md', 'sm:text-right', 'col-span-2',];
  return {
    form: form.filter(Boolean).join(' '),
    header: header.filter(Boolean).join(' '),
    title: title.filter(Boolean).join(' '),
    description: description.filter(Boolean).join(' '),
    fields: fields.filter(Boolean).join(' '),
    footer: footer.filter(Boolean).join(' '),
    formFields: formFields.filter(Boolean).join(' '),
    checkbox: checkbox.filter(Boolean).join(' '),
    card: card.filter(Boolean).join(' '),
    textarea: textarea.filter(Boolean).join(' '),
    content: content.filter(Boolean).join(' '),
    secondaryText: secondaryText.filter(Boolean).join(' '),
  };
}
