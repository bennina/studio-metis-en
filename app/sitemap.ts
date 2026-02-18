// app/sitemap.ts
import type { MetadataRoute } from "next";
import { listAllRoutes } from "@/lib/pages";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.metiswebagency.com/").replace(
    /\/$/,
    ""
  );

// cache 1h (puoi alzare/abbassare)
export const revalidate = 3600;

function toUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await listAllRoutes(); // es: [[], ["chi-siamo"], ["servizi","ristrutturazioni"], ...]

  const paths = routes.map((parts) => "/" + parts.join("/"));

  // Extra pages non necessariamente presenti nei JSON (se poi la crei come JSON, rimane duplicata: la filtriamo)
  const extras = ["/email-sent"];

  const all = Array.from(new Set([...paths, ...extras]));

  const items: MetadataRoute.Sitemap = all.map((pathname) => ({
    url: toUrl(pathname === "//" ? "/" : pathname),
    lastModified: new Date(), // se vuoi, poi lo agganciamo al mtime del JSON
    changeFrequency: pathname === "/" ? "weekly" : "monthly",
    priority: pathname === "/" ? 1 : 0.7,
  }));

  return items;
}
