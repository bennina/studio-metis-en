// app/[[...slug]]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { getPageBySlugParts, listAllRoutes } from "@/lib/pages";
import { footerConfig, navigationConfig } from "@/lib/siteLayoutConfig";
import { mapPageSchemaToConfigs } from "@/schema/mapSchemaToConfig";
import { buildMetadataFromPageSchema } from "@/seo/buildMetadataFromPageSchema";

type PageParams = { slug?: string[]; variant?: "default" | "landing" };
type PageProps = { params: Promise<PageParams> };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<PageParams[]> {
  const routes = await listAllRoutes(); // es: [[], ["chi-siamo"], ...]
  return routes.map((slugArr) => ({ slug: slugArr }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;

  const page = await getPageBySlugParts(slug);
  if (!page) return {};

  return buildMetadataFromPageSchema(page.seo);
}

export default async function Page({ params }: PageProps) {
  const { slug = [] } = await params;
  const { variant } = await params;
  const page = await getPageBySlugParts(slug);
  if (!page) notFound();

  const sectionsConfig = mapPageSchemaToConfigs(page);

  return (
    <PageWrapper
      variant={page.variant || "default"}
      navigation={navigationConfig}
      footer={footerConfig}
      sections={sectionsConfig}
    />
  );
}
