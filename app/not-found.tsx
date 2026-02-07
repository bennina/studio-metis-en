// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-container-max-width mx-auto px-container-md-side-spacer-lg py-20">
      <h1 className="text-3xl font-semibold mb-4">Pagina non trovata</h1>
      <p className="text-muted mb-8">
        La pagina che stai cercando non esiste (o non è ancora stata creata nei JSON).
      </p>
      <Link className="underline" href="/">
        Torna alla home
      </Link>
    </main>
  );
}
