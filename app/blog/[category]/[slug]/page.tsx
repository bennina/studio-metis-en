// app/blog/[category]/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section, Container, Title, JsonLd } from "@/components/atoms";
import { BlogPostsSection } from "@/components/sections/BlogPostsSection";
import { NavigationSection } from "@/components/sections/NavigationSection/NavigationSection";
import { FooterSection } from "@/components/sections/FooterSection/FooterSection";
import { navigationConfig, footerConfig } from "@/lib/siteLayoutConfig";
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  getPostsWithCategories,
  formatDate,
} from "@/lib/blog";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { Clock, Calendar, User } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.metiswebagency.it";

type PageParams = { category: string; slug: string };
type PageProps = { params: Promise<PageParams> };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<PageParams[]> {
  const slugs = await getAllPostSlugs();
  return slugs;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlug(category, slug);

  if (!post) return {};

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt;
  const ogImage = post.seo?.ogImage ?? post.featuredImage.src;

  return {
    title,
    description,
    authors: [{ name: post.author.name }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { category, slug } = await params;

  const post = await getPostBySlug(category, slug);
  if (!post) notFound();

  // Ottieni post correlati
  const relatedPostsSlugs = await getRelatedPosts(post, 3);
  const allPosts = await getPostsWithCategories();
  const relatedPosts = allPosts.filter((p) =>
    relatedPostsSlugs.some((r) => r.slug === p.slug)
  );

  const postUrl = `${SITE_URL}/blog/${post.category}/${post.slug}`;

  // JSON-LD structured data
  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage.src,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
    url: postUrl,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.categoryData.name, url: `${SITE_URL}/blog/${post.category}` },
    { name: post.title },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <NavigationSection {...navigationConfig} />

      <main id="main-content" className="pt-24" tabIndex={-1}>
        {/* Hero articolo */}
        <Section paddingY="lg" background="default">
          <Container>
            <article className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-primary-600 mb-6">
                <a href="/blog" className="hover:text-primary-500">
                  Blog
                </a>
                <span aria-hidden="true">/</span>
                <a
                  href={`/blog/${post.category}`}
                  className="hover:text-primary-500"
                >
                  {post.categoryData.name}
                </a>
              </nav>

              {/* Titolo */}
              <Title variant="h1" tone="dark" className="mb-6">
                {post.title}
              </Title>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-600 mb-8 pb-8 border-b border-neutral-200">
                {/* Autore */}
                <div className="flex items-center gap-2">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} aria-hidden="true" />
                  )}
                  <span className="font-medium">{post.author.name}</span>
                </div>

                {/* Data */}
                <div className="flex items-center gap-2">
                  <Calendar size={16} aria-hidden="true" />
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                {/* Tempo di lettura */}
                {post.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} aria-hidden="true" />
                    <span>{post.readingTime} min di lettura</span>
                  </div>
                )}
              </div>

              {/* Immagine in evidenza */}
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  className="w-full h-auto object-cover aspect-video"
                />
              </div>

              {/* Contenuto */}
              <div
                className="prose prose-lg prose-primary max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-neutral-200">
                  <h2 className="text-sm font-semibold text-primary-900 mb-4">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-neutral-100 text-primary-700 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Autore bio */}
              {post.author.bio && (
                <div className="mt-12 p-6 bg-neutral-50 rounded-2xl">
                  <div className="flex items-start gap-4">
                    {post.author.avatar && (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-primary-900">
                        {post.author.name}
                      </h3>
                      <p className="text-sm text-primary-700 mt-1">
                        {post.author.bio}
                      </p>
                      {post.author.social && (
                        <div className="flex gap-4 mt-3">
                          {post.author.social.linkedin && (
                            <a
                              href={post.author.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500"
                            >
                              LinkedIn
                            </a>
                          )}
                          {post.author.social.twitter && (
                            <a
                              href={post.author.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500"
                            >
                              Twitter
                            </a>
                          )}
                          {post.author.social.website && (
                            <a
                              href={post.author.social.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-500"
                            >
                              Sito web
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          </Container>
        </Section>

        {/* Articoli correlati */}
        {relatedPosts.length > 0 && (
          <BlogPostsSection
            mode="posts"
            title="Articoli correlati"
            subtitle="Potrebbe interessarti anche"
            posts={relatedPosts}
            columns={3}
            paddingY="lg"
            background="subtle"
            align="center"
          />
        )}

        <FooterSection {...footerConfig} />
      </main>
    </>
  );
}
