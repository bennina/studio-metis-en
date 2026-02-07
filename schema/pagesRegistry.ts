// schema/pagesRegistry.ts
import type { PageSchema } from './pageSchema';
import { homePageSchema } from './demoHomePage';


const pages: Record<string, PageSchema> = {
  home: homePageSchema,
};

export function getPageSchemaBySlug(slug: string): PageSchema | null {
  return pages[slug] ?? null;
}
