// app/blog/[category]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section, Container, Title, Paragraph } from "@/components/atoms";
import { BlogPostsSection } from "@/components/sections/BlogPostsSection";
import { NavigationSection } from "@/components/sections/NavigationSection/NavigationSection";
import { FooterSection } from "@/components/sections/FooterSection/FooterSection";
import { navigationConfig, footerConfig } from "@/lib/siteLayoutConfig";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory,
  getPostsWithCategories,
} from "@/lib/blog";

type PageParams = { category: string };
type PageProps = { params: Promise<PageParams> };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<PageParams[]> {
  const categories = await getAllCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) return {};

  return {
    title: `${category.name} | Blog`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Blog`,
      description: category.description,
      images: category.image ? [category.image.src] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const allPosts = await getPostsWithCategories();
  const categoryPosts = allPosts.filter((p) => p.category === categorySlug);

  return (
    <>
      <NavigationSection {...navigationConfig} />

      <main id="main-content" className="pt-24" tabIndex={-1}>
        {/* Hero categoria */}
        <Section paddingY="lg" background="default">
          <Container>
            <div className="max-w-3xl">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-500 mb-4"
              >
                <span aria-hidden="true">&larr;</span>
                Torna al blog
              </a>

              <Title variant="h1" tone="dark" className="mb-4">
                {category.name}
              </Title>

              {category.description && (
                <Paragraph size="lg" tone="dark">
                  {category.description}
                </Paragraph>
              )}

              <p className="mt-4 text-sm text-primary-600">
                {categoryPosts.length}{" "}
                {categoryPosts.length === 1 ? "articolo" : "articoli"}
              </p>
            </div>
          </Container>
        </Section>

        {/* Posts della categoria */}
        <BlogPostsSection
          mode="posts"
          posts={categoryPosts}
          columns={3}
          paddingY="lg"
          background="subtle"
        />

        <FooterSection {...footerConfig} />
      </main>
    </>
  );
}
