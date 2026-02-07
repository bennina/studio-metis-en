// components/molecules/BlogCategoryCard/BlogCategoryCard.style.ts

export const getBlogCategoryCardClasses = () => {
  return {
    card: [
      "group",
      "relative",
      "flex",
      "flex-col",
      "overflow-hidden",
      "rounded-2xl",
      "bg-neutral-100",
      "border",
      "border-neutral-200",
      "transition-all",
      "duration-300",
      "hover:shadow-lg",
      "hover:border-primary-300",
      "aspect-[4/3]",
    ].join(" "),

    imageWrapper: [
      "absolute",
      "inset-0",
      "overflow-hidden",
    ].join(" "),

    image: [
      "w-full",
      "h-full",
      "object-cover",
      "transition-transform",
      "duration-500",
      "group-hover:scale-105",
    ].join(" "),

    overlay: [
      "absolute",
      "inset-0",
      "bg-gradient-to-t",
      "from-primary-900/80",
      "via-primary-900/40",
      "to-transparent",
    ].join(" "),

    content: [
      "relative",
      "z-10",
      "flex",
      "flex-col",
      "justify-end",
      "h-full",
      "p-6",
      "text-white",
    ].join(" "),

    name: [
      "text-xl",
      "font-bold",
      "mb-2",
      "group-hover:text-primary-200",
      "transition-colors",
    ].join(" "),

    description: [
      "text-sm",
      "text-neutral-200",
      "line-clamp-2",
    ].join(" "),

    link: [
      "absolute",
      "inset-0",
      "z-20",
    ].join(" "),
  };
};
