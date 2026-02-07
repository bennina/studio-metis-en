// lib/blog/index.ts
// Helper functions per il sistema blog

import { promises as fs } from "fs";
import path from "path";
import type {
  BlogPost,
  BlogCategory,
  BlogPostWithCategory,
  BlogPostsSectionConfig,
} from "./types";

const BLOG_CONTENT_PATH = path.join(process.cwd(), "content", "blog");
const CATEGORIES_PATH = path.join(BLOG_CONTENT_PATH, "categories");
const POSTS_PATH = path.join(BLOG_CONTENT_PATH, "posts");

/**
 * Legge tutti i file JSON da una directory
 */
async function readJsonFiles<T>(dirPath: string): Promise<T[]> {
  try {
    const files = await fs.readdir(dirPath);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(dirPath, file), "utf-8");
        return JSON.parse(content) as T;
      })
    );

    return items;
  } catch (error) {
    console.error(`Error reading JSON files from ${dirPath}:`, error);
    return [];
  }
}

/**
 * Ottiene tutte le categorie del blog
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  const categories = await readJsonFiles<BlogCategory>(CATEGORIES_PATH);
  return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Ottiene una categoria per slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<BlogCategory | null> {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

/**
 * Ottiene tutti i post pubblicati
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await readJsonFiles<BlogPost>(POSTS_PATH);

  // Filtra solo i post pubblicati
  const publishedPosts = posts.filter(
    (p) => p.status === "published" || p.status === undefined
  );

  // Ordina per data di pubblicazione (più recenti prima)
  return publishedPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Ottiene i post per una categoria specifica
 */
export async function getPostsByCategory(
  categorySlug: string
): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.category === categorySlug);
}

/**
 * Ottiene un singolo post per categoria e slug
 */
export async function getPostBySlug(
  categorySlug: string,
  postSlug: string
): Promise<BlogPostWithCategory | null> {
  const posts = await getAllPosts();
  const post = posts.find(
    (p) => p.category === categorySlug && p.slug === postSlug
  );

  if (!post) return null;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  return {
    ...post,
    categoryData: category,
  };
}

/**
 * Ottiene i post con le categorie popolate
 */
export async function getPostsWithCategories(): Promise<BlogPostWithCategory[]> {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  return posts
    .map((post) => {
      const categoryData = categoryMap.get(post.category);
      if (!categoryData) return null;
      return { ...post, categoryData };
    })
    .filter((p): p is BlogPostWithCategory => p !== null);
}

/**
 * Ottiene i post correlati (escluso il post corrente)
 */
export async function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = 3
): Promise<BlogPost[]> {
  const posts = await getAllPosts();

  // Prima cerca post della stessa categoria
  let related = posts.filter(
    (p) => p.category === currentPost.category && p.slug !== currentPost.slug
  );

  // Se non abbastanza, aggiungi post con tag in comune
  if (related.length < limit && currentPost.tags?.length) {
    const otherPosts = posts.filter(
      (p) =>
        p.slug !== currentPost.slug &&
        !related.find((r) => r.slug === p.slug) &&
        p.tags?.some((t) => currentPost.tags?.includes(t))
    );
    related = [...related, ...otherPosts];
  }

  return related.slice(0, limit);
}

/**
 * Ottiene tutti gli slug per la generazione statica delle pagine
 */
export async function getAllPostSlugs(): Promise<
  { category: string; slug: string }[]
> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ category: p.category, slug: p.slug }));
}

/**
 * Ottiene i post filtrati secondo la configurazione BlogPostsSectionConfig
 */
export async function getPostsForSection(
  config: BlogPostsSectionConfig
): Promise<BlogPostWithCategory[]> {
  let posts = await getPostsWithCategories();

  // Filtra per categoria se specificata
  if (config.category) {
    posts = posts.filter((p) => p.category === config.category);
  }

  // Escludi post specifici
  if (config.exclude?.length) {
    posts = posts.filter((p) => !config.exclude?.includes(p.slug));
  }

  // Ordina
  if (config.order === "oldest") {
    posts = posts.reverse();
  }

  // Limita il numero
  if (config.limit && config.limit > 0) {
    posts = posts.slice(0, config.limit);
  }

  return posts;
}

/**
 * Calcola il tempo di lettura stimato (parole al minuto = 200)
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Formatta la data in italiano
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
