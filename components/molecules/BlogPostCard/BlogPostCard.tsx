// components/molecules/BlogPostCard/BlogPostCard.tsx
import type { FC } from "react";
import { Clock } from "lucide-react";
import type { BlogPostWithCategory } from "@/lib/blog/types";
import { formatDate } from "@/lib/blog";
import {
  getBlogPostCardClasses,
  type BlogPostCardVariant,
} from "./BlogPostCard.style";

export interface BlogPostCardProps {
  post: BlogPostWithCategory;
  variant?: BlogPostCardVariant;
  className?: string;
  /** Se true, usa i dati preview invece di quelli principali */
  usePreview?: boolean;
}

export const BlogPostCard: FC<BlogPostCardProps> = ({
  post,
  variant = "default",
  className = "",
  usePreview = true,
}) => {
  const classes = getBlogPostCardClasses({ variant });

  // Usa i dati preview se disponibili e richiesti
  const title = usePreview && post.preview?.title ? post.preview.title : post.title;
  const subtitle = usePreview ? post.preview?.subtitle : undefined;
  const description =
    usePreview && post.preview?.description
      ? post.preview.description
      : post.excerpt;
  const image =
    usePreview && post.preview?.image ? post.preview.image : post.featuredImage;

  const postUrl = `/blog/${post.category}/${post.slug}`;

  return (
    <article className={[classes.card, className].filter(Boolean).join(" ")}>
      {/* Link invisibile per tutta la card */}
      <a
        href={postUrl}
        className={classes.link}
        aria-label={`Leggi l'articolo: ${title}`}
      />

      {/* Immagine */}
      <div className={classes.imageWrapper}>
        <img
          src={image.src}
          alt={image.alt}
          className={classes.image}
          loading="lazy"
        />
      </div>

      {/* Contenuto */}
      <div className={classes.content}>
        {/* Categoria */}
        <span className={classes.category}>{post.categoryData.name}</span>

        {/* Titolo */}
        <h3 className={classes.title}>{title}</h3>

        {/* Sottotitolo (se presente) */}
        {subtitle && <p className={classes.subtitle}>{subtitle}</p>}

        {/* Descrizione */}
        <p className={classes.description}>{description}</p>

        {/* Meta info */}
        <div className={classes.meta}>
          {/* Autore */}
          {post.author && (
            <div className={classes.author}>
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className={classes.authorAvatar}
                />
              )}
              <span>{post.author.name}</span>
            </div>
          )}

          {/* Data */}
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>

          {/* Tempo di lettura */}
          {post.readingTime && (
            <div className={classes.readingTime}>
              <Clock size={12} aria-hidden="true" />
              <span>{post.readingTime} min</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
