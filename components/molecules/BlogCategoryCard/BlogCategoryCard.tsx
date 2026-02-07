// components/molecules/BlogCategoryCard/BlogCategoryCard.tsx
import type { FC } from "react";
import type { BlogCategory } from "@/lib/blog/types";
import { getBlogCategoryCardClasses } from "./BlogCategoryCard.style";

export interface BlogCategoryCardProps {
  category: BlogCategory;
  className?: string;
  /** Numero di post nella categoria (opzionale) */
  postCount?: number;
}

export const BlogCategoryCard: FC<BlogCategoryCardProps> = ({
  category,
  className = "",
  postCount,
}) => {
  const classes = getBlogCategoryCardClasses();

  const categoryUrl = `/blog/${category.slug}`;

  return (
    <article className={[classes.card, className].filter(Boolean).join(" ")}>
      {/* Link invisibile per tutta la card */}
      <a
        href={categoryUrl}
        className={classes.link}
        aria-label={`Vai alla categoria: ${category.name}`}
      />

      {/* Immagine di sfondo */}
      {category.image && (
        <div className={classes.imageWrapper}>
          <img
            src={category.image.src}
            alt={category.image.alt}
            className={classes.image}
            loading="lazy"
          />
        </div>
      )}

      {/* Overlay gradient */}
      <div className={classes.overlay} aria-hidden="true" />

      {/* Contenuto */}
      <div className={classes.content}>
        <h3 className={classes.name}>
          {category.name}
          {typeof postCount === "number" && (
            <span className="ml-2 text-sm font-normal opacity-70">
              ({postCount} {postCount === 1 ? "articolo" : "articoli"})
            </span>
          )}
        </h3>

        {category.description && (
          <p className={classes.description}>{category.description}</p>
        )}
      </div>
    </article>
  );
};
