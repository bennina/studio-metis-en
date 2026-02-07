// components/sections/BlogPostsSection/BlogPostsSection.style.ts

export type BlogPostsSectionColumns = 2 | 3 | 4;
export type BlogPostsSectionAlign = "left" | "center";

interface BlogPostsSectionStyleParams {
  columns: BlogPostsSectionColumns;
  align: BlogPostsSectionAlign;
}

const columnsMap: Record<BlogPostsSectionColumns, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export const getBlogPostsSectionClasses = ({
  columns,
  align,
}: BlogPostsSectionStyleParams) => {
  return {
    inner: [
      "flex",
      "flex-col",
      "gap-12",
    ].join(" "),

    header: [
      "flex",
      "flex-col",
      align === "center" ? "items-center text-center" : "",
      "gap-4",
      "max-w-3xl",
      align === "center" ? "mx-auto" : "",
    ]
      .filter(Boolean)
      .join(" "),

    title: [
      "text-3xl",
      "md:text-4xl",
      "font-bold",
      "text-primary-900",
    ].join(" "),

    subtitle: [
      "text-lg",
      "text-primary-700",
    ].join(" "),

    grid: [
      "grid",
      "grid-cols-1",
      columnsMap[columns],
      "gap-6",
      "lg:gap-8",
    ].join(" "),

    footer: [
      "flex",
      align === "center" ? "justify-center" : "",
      "pt-4",
    ]
      .filter(Boolean)
      .join(" "),

    emptyState: [
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "py-16",
      "text-center",
    ].join(" "),
  };
};
