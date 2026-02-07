// components/sections/BlogPostsSection/BlogPostsSection.tsx
import type { FC } from "react";
import { Section, Container, Button } from "@/components/atoms";
import { BlogPostCard } from "@/components/molecules/BlogPostCard";
import { BlogCategoryCard } from "@/components/molecules/BlogCategoryCard";
import type {
  SectionPaddingY,
  SectionBackground,
} from "@/components/atoms/Section/Section.style";
import type {
  BlogPostWithCategory,
  BlogCategory,
  BlogPostsSectionConfig,
} from "@/lib/blog/types";
import {
  getBlogPostsSectionClasses,
  type BlogPostsSectionColumns,
  type BlogPostsSectionAlign,
} from "./BlogPostsSection.style";

export interface BlogPostsSectionProps extends BlogPostsSectionConfig {
  id?: string;
  paddingY?: SectionPaddingY;
  background?: SectionBackground;
  align?: BlogPostsSectionAlign;
  className?: string;

  /** Posts da mostrare (passati dal server) */
  posts?: BlogPostWithCategory[];
  /** Categorie da mostrare (passate dal server) */
  categories?: BlogCategory[];
  /** Conteggio post per categoria (opzionale) */
  categoryPostCounts?: Record<string, number>;
}

/**
 * BlogPostsSection
 *
 * Sezione dinamica che mostra:
 * - mode: "posts" → griglia di post
 * - mode: "categories" → griglia di categorie
 *
 * Riceve i dati già fetchati dal server (per RSC).
 */
export const BlogPostsSection: FC<BlogPostsSectionProps> = ({
  id,
  mode = "posts",
  title,
  subtitle,
  limit,
  columns = 3,
  variant = "default",
  showViewAll = false,
  viewAllUrl,
  paddingY = "lg",
  background = "default",
  align = "left",
  className = "",
  posts = [],
  categories = [],
  categoryPostCounts = {},
}) => {
  const classes = getBlogPostsSectionClasses({
    columns: columns as BlogPostsSectionColumns,
    align,
  });

  const hasContent =
    (mode === "posts" && posts.length > 0) ||
    (mode === "categories" && categories.length > 0);

  // Determina l'URL del "Vedi tutti"
  const getViewAllUrl = () => {
    if (viewAllUrl) return viewAllUrl;
    return mode === "categories" ? "/blog" : "/blog";
  };

  return (
    <Section
      id={id}
      paddingY={paddingY}
      background={background}
      className={className}
    >
      <Container>
        <div className={classes.inner}>
          {/* Header */}
          {(title || subtitle) && (
            <header className={classes.header}>
              {title && <h2 className={classes.title}>{title}</h2>}
              {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
            </header>
          )}

          {/* Contenuto */}
          {hasContent ? (
            <div className={classes.grid}>
              {mode === "posts" &&
                posts.map((post) => (
                  <BlogPostCard
                    key={post.slug}
                    post={post}
                    variant={variant === "featured" ? "featured" : "default"}
                  />
                ))}

              {mode === "categories" &&
                categories.map((category) => (
                  <BlogCategoryCard
                    key={category.slug}
                    category={category}
                    postCount={categoryPostCounts[category.slug]}
                  />
                ))}
            </div>
          ) : (
            <div className={classes.emptyState}>
              <p className="text-primary-600">
                {mode === "posts"
                  ? "Nessun articolo disponibile."
                  : "Nessuna categoria disponibile."}
              </p>
            </div>
          )}

          {/* Footer con "Vedi tutti" */}
          {showViewAll && hasContent && (
            <div className={classes.footer}>
              <Button variant="outlinePrimary" href={getViewAllUrl()}>
                {mode === "posts" ? "Vedi tutti gli articoli" : "Tutte le categorie"}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};
