// components/molecules/SocialLink/SocialLink.style.ts

import { ButtonSize } from "@/components/atoms";

export type SocialLinkVariant = "default" | "pill" | "ghost" | "ghostDark" | 'outline';
export type ButtonSizeVariant = ButtonSize;

export interface SocialLinkStyleOptions {
  variant?: SocialLinkVariant;
  size?: ButtonSize;
}

const sizeMap: Record<ButtonSize, string> = {
  sm: "aspect-square px-1 grid items-center [&_svg]:w-4",
  md: "aspect-square px-1 grid items-center [&_svg]:w-5",
  lg: "aspect-square px-2 grid items-center [&_svg]:w-5",
};

const variantMap: Record<SocialLinkVariant, string> = {
  default:
    "inline-flex items-center justify-center  rounded-full bg-[var(--color-neutral-900)] text-primary-900 hover:bg-[var(--color-primary-500)]/ hover:text-white transition-colors duration-150",
  pill: "inline-flex items-center gap-2 h-9 px-3 rounded-full bg-primary-900 text-[var(--color-primary-300)]  hover:bg-[var(--color-primary-500)]/ hover:text-white transition-colors duration-150",
  ghost:
    "inline-flex items-center  justify-center  bg-primary-100/30 rounded-full hover:bg-primary-100/30 transition-colors duration-150",
  ghostDark:
    "inline-flex items-center text-[var(--color-neutral-100)] justify-center bg-[var(--color-neutral-900)] backdrop-blur-none rounded-full hover:bg-[var(--color-neutral-600)] transition-colors duration-150",
  outline: 'bg-transparent text-[var(--color-primary-800)] hover:text-primary-100 hover:bg-[var(--color-primary-700)] rounded-full',
};

export function getSocialLinkClasses(options: SocialLinkStyleOptions = {}) {
  
  const { variant = "default", size = "lg" } = options;

  

  const base: string[] = [variantMap[variant]];
  const icon: string = sizeMap[size];
  return {
    root: base.filter(Boolean).join(" "),
    icon,
  };
}
