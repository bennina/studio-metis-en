// app/brief/page.tsx
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { BriefPageClient } from './BriefPageClient';
import { LoginPageClient } from './LoginPageClient';

const COOKIE_NAME = 'showcases_auth';

export const metadata: Metadata = {
  title: 'Brief Builder | Metis Web Agency',
  description: 'Strumento interno per la creazione di preventivi',
  robots: 'noindex, nofollow',
};

export default async function BriefPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  const isAuthenticated = !!authCookie?.value;

  if (!isAuthenticated) {
    return <LoginPageClient />;
  }

  return <BriefPageClient />;
}
