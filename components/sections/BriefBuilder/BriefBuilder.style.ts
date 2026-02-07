// components/sections/BriefBuilder/BriefBuilder.style.ts

export function getBriefBuilderClasses() {
  return {
    root: 'min-h-screen bg-neutral-900',
    container: 'max-w-6xl mx-auto px-md py-lg',

    // Header
    header: 'grid gap-lg mb-xl text-center',
    headerTitle: '',
    headerSubtitle: '',
    fields: 'placeholder:text-primary-100',
    // Progress bar - horizontal slider
    progress: 'mb-xl',
    progressBar: 'h-1 bg-primary-100 rounded-full overflow-hidden mb-md',
    progressFill: 'h-full bg-primary-500 transition-all duration-300',
    progressSteps: [
      'flex gap-sm overflow-x-auto pb-sm -mx-md px-md',
      'scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]',
    ].join(' '),
    progressStep: [
      'flex-shrink-0 px-md py-sm rounded-full text-sm',
      'bg-primary-100 text-primary-900',
      'hover:bg-neutral-700 hover:text-white cursor-pointer transition-all',
      'whitespace-nowrap',
    ].join(' '),
    progressStepActive: [
      'flex-shrink-0 px-md py-sm rounded-full text-sm font-medium',
      'bg-primary-500 text-white',
      'cursor-pointer transition-all whitespace-nowrap',
    ].join(' '),
    progressStepCompleted: [
      'flex-shrink-0 px-md py-sm rounded-full text-sm',
      'bg-accent-500/20 text-accent-400',
      'hover:bg-accent-500/30 cursor-pointer transition-all',
      'whitespace-nowrap',
    ].join(' '),

    // Content area
    content: 'grid grid-cols-1 lg:grid-cols-3 gap-lg',
    mainPanel: 'lg:col-span-2',
    sidePanel: 'lg:col-span-1',

    // Step card
    stepCard: 'bg-primary-600 backdrop-blur-xl border border-primary-100/30 rounded-xl p-lg grid gap-6',
    stepTitle: 'text-h4 text-white',
    stepDescription: 'text-sm text-white ',

    // Form elements
    formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-md',
    formGroup: 'flex flex-col gap-xs',
    formLabel: 'text-sm font-medium text-neutral-100',
    formHint: 'text-xs text-neutral-100 mt-xs',

    // Service selection
    serviceCategory: 'mb-lg',
    serviceCategoryTitle: 'text-lg font-semibold text-white mb-md flex items-center gap-sm',
    serviceGrid: 'grid grid-cols-1 gap-sm',
    serviceCard: [
      'p-md rounded-lg rounded-xl p-lg bg-primary-100/20 backdrop-blur-xl border border-primary-100/30',
      ' cursor-pointer transition-all',
    ].join(' '),
    serviceCardSelected: [
      'p-md rounded-lg border-2 border-primary-500 bg-primary-500/10',
      'cursor-pointer transition-all',
    ].join(' '),
    serviceName: 'font-medium text-white',
    serviceDescription: 'text-sm text-neutral-100 mt-xs',
    servicePrice: 'text-lg text-primary-800 mt-sm font-medium',
    serviceExpand: 'mt-md pt-md border-t border-neutral-700',
    serviceWhy: 'text-sm text-accent-100 mb-sm',
    serviceBenefits: 'space-y-xs',
    serviceBenefit: 'text-sm text-accent-100 flex items-start gap-sm',
    serviceBenefitIcon: 'text-accent-500 mt-0.5 shrink-0',

    // Summary panel
    summary: 'bg-primary-500/80 backdrop-blur-xl rounded-xl p-lg sticky top-lg',
    summaryTitle: 'text-lg font-semibold text-white mb-md',
    summarySection: 'mb-md',
    summarySectionTitle: 'text-sm font-medium text-primary-900 mb-sm uppercase tracking-wide',
    summaryItem: 'flex justify-between items-center py-xs text-sm',
    summaryItemName: 'text-neutral-100',
    summaryItemPrice: 'text-white font-medium',
    summaryDivider: 'border-t bg-primary-500/80 backdrop-blur-xl my-md',
    summaryTotal: 'flex justify-between items-center py-sm',
    summaryTotalLabel: 'text-lg font-semibold text-white',
    summaryTotalPrice: 'text-xl font-bold text-accent-400',
    summaryRecurring: 'text-sm text-primary-800 mt-sm',
    summaryNote: 'text-xs text-primary-800 mt-md p-lg bg-neutral-100 rounded-lg',

    // Navigation
    navigation: 'flex justify-between items-center mt-xl pt-lg border-t border-primary-700',
    navButton: 'px-lg py-sm rounded-lg font-medium transition-colors',
    navButtonBack: 'bg-neutral-700 text-white hover:bg-neutral-600',
    navButtonNext: 'bg-primary-500 text-white hover:bg-primary-400',
    navButtonGenerate: 'bg-accent-500 text-white hover:bg-accent-400',

    // Radio/Checkbox options
    optionGrid: 'grid grid-cols-1 md:grid-cols-2 gap-sm',
    optionCard: [
      'p-md rounded-lg border-2 border-primary-900',
      ' cursor-pointer transition-all',
    ].join(' '),
    optionCardSelected: [
      'p-md rounded-lg border-2 border-primary-200/80 bg-primary-200/80',
      'cursor-pointer transition-all',
    ].join(' '),
    optionTitle: 'font-medium text-primary-600',
    optionTitledSelected: 'font-medium text-primary-100',
    optionDescription: 'text-sm text-muted mt-xs',
    options: 'border-primary-100',
    optionsSelected: "bg-primary-500 border-primary-500",
    // Quantity selector
    quantityWrapper: 'flex items-center gap-sm mt-sm',
    quantityButton: 'w-8 h-8 rounded-lg bg-neutral-700 text-white flex items-center justify-center hover:bg-neutral-600',
    quantityValue: 'w-12 text-center font-medium text-white',
  };
}
