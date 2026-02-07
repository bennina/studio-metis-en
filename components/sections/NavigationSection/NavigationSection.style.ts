// components/sections/NavigationSection/NavigationSection.style.ts

export type NavigationLayout =
  | "logo-only"
  | "inline"
  | "burger"
  | "inline-with-burger";

export type StickyMode = "none" | "always" | "mobile";

export interface NavigationSectionStyleOptions {
  stickyMode?: StickyMode;
  hasTopBar?: boolean;
}

export function getNavigationSectionClasses(
  options: NavigationSectionStyleOptions = {}
) {
  const { stickyMode = "none", hasTopBar = false } = options;

  const wrapper: string[] = ["w-full"];

  if (stickyMode === "always") {
    wrapper.push("fixed", "top-0", "z-50", "px-12");
  } else if (stickyMode === "mobile") {
    wrapper.push("lg:fixed", "top-0", "z-50", "md:static");
  }

  const topBar: string[] = [
    "px-3",
    "py-3",
    "text-xs",
    "flex",
    "items-center",
    "justify-between",
    "gap-3",
  ];

  const mainBar: string[] = [
    
    "py-6",
    "flex",
    "items-center",
    "justify-between",
    "gap-6",
    "overflow-hidden",
  ];

  if (!hasTopBar) {
    mainBar.push();
  }

  return {
    wrapper: wrapper.filter(Boolean).join(" "),
    topBar: topBar.filter(Boolean).join(" "),
    mainBar: mainBar.filter(Boolean).join(" "),
  };
}
