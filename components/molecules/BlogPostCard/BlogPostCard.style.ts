// components/molecules/BlogPostCard/BlogPostCard.style.ts

export type BlogPostCardVariant = "default" | "compact" | "featured";

interface BlogPostCardStyleParams {
  variant: BlogPostCardVariant;
}

export const getBlogPostCardClasses = ({ variant }: BlogPostCardStyleParams) => {
  const baseCard = [
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
  ];

  const variantClasses: Record<BlogPostCardVariant, string[]> = {
    default: [],
    compact: ["max-w-sm"],
    featured: ["md:flex-row", "md:items-stretch"],
  };

  return {
    card: [...baseCard, ...variantClasses[variant]].join(" "),

    imageWrapper: [
      "relative",
      "aspect-video",
      "overflow-hidden",
      variant === "featured" ? "md:w-1/2 md:aspect-auto md:min-h-[300px]" : "",
    ]
      .filter(Boolean)
      .join(" "),

    image: [
      "w-full",
      "h-full",
      "object-cover",
      "transition-transform",
      "duration-500",
      "group-hover:scale-105",
    ].join(" "),

    content: [
      "flex",
      "flex-col",
      "gap-3",
      "p-6",
      variant === "featured" ? "md:w-1/2 md:justify-center" : "",
    ]
      .filter(Boolean)
      .join(" "),

    category: [
      "inline-flex",
      "items-center",
      "gap-1",
      "text-xs",
      "font-semibold",
      "uppercase",
      "tracking-wider",
      "text-primary-600",
    ].join(" "),

    title: [
      "text-lg",
      "font-bold",
      "text-primary-900",
      "line-clamp-2",
      "group-hover:text-primary-600",
      "transition-colors",
      variant === "featured" ? "md:text-2xl" : "",
    ]
      .filter(Boolean)
      .join(" "),

    subtitle: [
      "text-sm",
      "font-medium",
      "text-primary-700",
    ].join(" "),

    description: [
      "text-sm",
      "text-primary-700",
      "line-clamp-3",
    ].join(" "),

    meta: [
      "flex",
      "items-center",
      "gap-4",
      "mt-auto",
      "pt-4",
      "text-xs",
      "text-primary-600",
    ].join(" "),

    author: [
      "flex",
      "items-center",
      "gap-2",
    ].join(" "),

    authorAvatar: [
      "w-6",
      "h-6",
      "rounded-full",
      "object-cover",
    ].join(" "),

    date: [],

    readingTime: [
      "flex",
      "items-center",
      "gap-1",
    ].join(" "),

    link: [
      "absolute",
      "inset-0",
      "z-10",
    ].join(" "),
  };
};
