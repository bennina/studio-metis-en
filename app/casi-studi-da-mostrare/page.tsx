// app/casi-studi-da-mostrare/page.tsx
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { getPageBySlugParts } from '@/lib/pages';
import { footerConfig, navigationConfig } from '@/lib/siteLayoutConfig';
import { mapPageSchemaToConfigs } from '@/schema/mapSchemaToConfig';
import { buildMetadataFromPageSchema } from '@/seo/buildMetadataFromPageSchema';
import { LoginPageClient } from './LoginPageClient';

const COOKIE_NAME = 'showcases_auth';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugParts(['casi-studi-da-mostrare']);
  if (!page) return {};

  return buildMetadataFromPageSchema(page.seo);
}

export default async function CasiStudiPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  const isAuthenticated = !!authCookie?.value;

  const page = await getPageBySlugParts(['casi-studi-da-mostrare']);

  // Se non autenticato, mostra il form di login
  if (!isAuthenticated) {
    return <LoginPageClient />;
  }

  // Se autenticato, mostra il contenuto della pagina
  if (!page) {
    return <div>Pagina non trovata</div>;
  }

  const sectionsConfig = mapPageSchemaToConfigs(page);

  return (
    <PageWrapper
      variant={page.variant || 'default'}
      navigation={navigationConfig}
      footer={footerConfig}
      sections={sectionsConfig}
    />
  );
}
