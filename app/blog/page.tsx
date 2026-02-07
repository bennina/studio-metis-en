// app/blog/page.tsx
import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";

import { Section, Container, Title, Paragraph } from "@/components/atoms";
import { BlogPostsSection } from "@/components/sections/BlogPostsSection";
import { NavigationSection } from "@/components/sections/NavigationSection/NavigationSection";
import { FooterSection } from "@/components/sections/FooterSection/FooterSection";
import { navigationConfig, footerConfig } from "@/lib/siteLayoutConfig";
import {
  getAllCategories,
  getPostsWithCategories,
  getPostsByCategory,
} from "@/lib/blog";
import type { BlogIndexConfig } from "@/lib/blog/types";

async function getBlogConfig(): Promise<BlogIndexConfig> {
  try {
    const configPath = path.join(
      process.cwd(),
      "content",
      "blog",
      "config.json"
    );
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return {
      title: "Blog",
      description: "Gli ultimi articoli dal nostro blog.",
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getBlogConfig();

  return {
    title: config.seo?.title ?? config.title,
    description: config.seo?.description ?? config.description,
    openGraph: {
      title: config.seo?.title ?? config.title,
      description: config.seo?.description ?? config.description,
      images: config.seo?.ogImage ? [config.seo.ogImage] : undefined,
    },
  };
}

export default async function BlogPage() {
  const [config, categories, posts] = await Promise.all([
    getBlogConfig(),
    getAllCategories(),
    getPostsWithCategories(),
  ]);

  // Calcola il conteggio post per categoria
  const categoryPostCounts: Record<string, number> = {};
  for (const category of categories) {
    const categoryPosts = await getPostsByCategory(category.slug);
    categoryPostCounts[category.slug] = categoryPosts.length;
  }

  return (
    <>
      <NavigationSection {...navigationConfig} />

      <main id="main-content" className="pt-24" tabIndex={-1}>
        {/* Hero */}
        <Section paddingY="lg" background="default">
          <Container>
            <div className="max-w-3xl">
              <Title variant="h1" tone="dark" className="mb-4">
                {config.title}
              </Title>
              <Paragraph size="lg" tone="dark">
                {config.description}
              </Paragraph>
            </div>
          </Container>
        </Section>

        {/* Categorie */}
        <BlogPostsSection
          mode="categories"
          title="Esplora per categoria"
          columns={4}
          categories={categories}
          categoryPostCounts={categoryPostCounts}
          paddingY="lg"
          background="subtle"
        />

        {/* Ultimi articoli */}
        <BlogPostsSection
          mode="posts"
          title="Ultimi articoli"
          subtitle="Resta aggiornato con i nostri ultimi contenuti"
          posts={posts}
          columns={3}
          paddingY="lg"
          align="left"
        />

        <FooterSection {...footerConfig} />
      </main>
    </>
  );
}
