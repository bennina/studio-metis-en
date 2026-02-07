// components/molecules/LoginForm/LoginForm.style.ts

export type LoginFormVariant = 'default' | 'glass';

export interface LoginFormStyleOptions {
  variant?: LoginFormVariant;
}

const variantMap: Record<LoginFormVariant, { card: string; header: string }> = {
  default: {
    card: 'bg-neutral-900 border border-neutral-700',
    header: 'text-white',
  },
  glass: {
    card: 'bg-primary-100/20 backdrop-blur-xl border border-primary-100/30',
    header: 'text-white',
  },
};

export function getLoginFormClasses(options: LoginFormStyleOptions = {}) {
  const { variant = 'default' } = options;

  return {
    root: 'w-full mx-auto',
    card: [
      'rounded-xl',
      'p-lg',
      'shadow-lg',
      variantMap[variant].card,
    ].join(' '),
    header: [
      'text-center',
      'mb-lg',
      variantMap[variant].header,
    ].join(' '),
    title: '',
    subtitle: '',
    form: 'flex flex-col gap-md',
    fieldGroup: 'flex flex-col gap-md',
    actions: 'flex flex-col gap-sm mt-sm',
    footer: 'flex items-center justify-between mt-md',
    rememberMe: 'flex items-center gap-sm',
    forgotPassword: 'text-sm text-primary-400 hover:text-primary-300 transition-colors',
    divider: 'flex items-center gap-md my-md',
    dividerLine: 'flex-1 h-px bg-neutral-700',
    dividerText: 'text-sm text-muted',
    registerLink: 'text-center text-sm text-muted mt-md',
    registerLinkAnchor: 'text-primary-400 hover:text-primary-300 transition-colors ml-1',
  };
}
