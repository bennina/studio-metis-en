// app/casi-studi-da-mostrare/LoginPageClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/atoms';
import { LoginForm } from '@/components/molecules';

export function LoginPageClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh della pagina per mostrare il contenuto protetto
        router.refresh();
      } else {
        setError(result.error || 'Credenziali non valide');
      }
    } catch {
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      background="primaryGradients"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-md:max-w-[300px] max-w-[700px] px-md">
        <LoginForm
          variant="glass"
          mode="username"
          title="Area Riservata"
          subtitle="Inserisci le credenziali per accedere ai case studies"
          usernameLabel="Username"
          usernamePlaceholder="Il tuo username"
          submitLabel="Accedi"
          showForgotPassword={false}
          showRegisterLink={false}
          showRememberMe={true}
          rememberMeLabel="Ricordami per 7 giorni"
          loading={loading}
          error={error}
          onSubmit={handleLogin}
        />
      </div>
    </Section>
  );
}
