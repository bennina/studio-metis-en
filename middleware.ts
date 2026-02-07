// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware per le pagine protette (casi-studi, brief builder).
 * L'autenticazione è gestita direttamente nelle pagine tramite:
 * - Cookie 'showcases_auth' settato dall'API /api/auth/login
 * - Componente LoginForm che mostra il form se non autenticato
 */
export function middleware(req: NextRequest) {
  // Il middleware lascia passare tutte le richieste
  // L'autenticazione viene verificata server-side nella pagina
  return NextResponse.next();
}

export const config = {
  matcher: ["/casi-studi-da-mostrare/:path*", "/brief/:path*"],
};
