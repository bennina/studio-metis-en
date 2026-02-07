// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'showcases_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 giorni

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Credenziali da environment variables
    const validUser = process.env.SHOWCASES_USERNAME || 'metis';
    const validPass = process.env.SHOWCASES_PASSWORD;

    if (!validPass) {
      return NextResponse.json(
        { error: 'Autenticazione non configurata' },
        { status: 500 }
      );
    }

    // Verifica credenziali (email usata come username)
    if (email === validUser && password === validPass) {
      // Crea token semplice (in produzione usare JWT o sessioni sicure)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      const response = NextResponse.json({ success: true });

      // Setta il cookie di autenticazione
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? COOKIE_MAX_AGE : undefined, // Session cookie se non "ricordami"
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Credenziali non valide' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Errore durante il login' },
      { status: 400 }
    );
  }
}
