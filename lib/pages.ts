// lib/pages.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PageSchema } from "@/schema/pageSchema";

// Preferiamo content/pages; se non esiste, fallback su schema/pages.
const CONTENT_DIR = path.join(process.cwd(), "content/pages");
const SCHEMA_DIR = path.join(process.cwd(), "schema/pages");

type IndexEntry = {
  slug: string; // "" | "chi-siamo" | "servizi/bonus"
  filePath: string;
};

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function getPagesDir(): Promise<string> {
  if (process.env.PAGES_DIR) return path.join(process.cwd(), process.env.PAGES_DIR);
  if (await exists(CONTENT_DIR)) return CONTENT_DIR;
  if (await exists(SCHEMA_DIR)) return SCHEMA_DIR;
  // fallback "best effort"
  return CONTENT_DIR;
}

function normalizeSlug(slug: string): string {
  // Normalizziamo:
  // - trim
  // - rimozione slash iniziali/finali
  // - lower-case (così "Contatti" matcha /contatti)
  // - decodeURIComponent (così /chi-siamo%2Ftest funziona come previsto)
  const cleaned = String(slug ?? "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  try {
    return decodeURIComponent(cleaned).toLowerCase();
  } catch {
    return cleaned.toLowerCase();
  }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];

  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.isFile() && e.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function slugFromPath(pagesDir: string, absFile: string): string {
  const rel = path.relative(pagesDir, absFile).replace(/\\/g, "/");
  const noExt = rel.replace(/\.json$/, "");
  const cleaned = noExt.endsWith("/index") ? noExt.replace(/\/index$/, "") : noExt;
  if (cleaned === "index") return "";
  return cleaned;
}

let _cache: { at: number; pagesDir: string; entries: IndexEntry[] } | null = null;

async function buildIndex(pagesDir: string): Promise<IndexEntry[]> {
  const files = await walk(pagesDir);
  const entries: IndexEntry[] = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // JSON invalido -> skip (lo segnala pages:check)
      continue;
    }

    // deve essere una pagina (minimo)
    if (!parsed || typeof parsed !== "object") continue;
    if (!Array.isArray(parsed.sections)) continue;

    const slug =
      typeof parsed.slug === "string"
        ? normalizeSlug(parsed.slug)
        : normalizeSlug(slugFromPath(pagesDir, filePath));

    entries.push({ slug, filePath });
  }

  // warning duplicati in console (utile in dev)
  const seen = new Map<string, number>();
  for (const e of entries) seen.set(e.slug, (seen.get(e.slug) ?? 0) + 1);
  for (const [slug, count] of seen) {
    if (count > 1) console.warn(`[pages] slug duplicato "${slug}" (${count} file)`);
  }

  return entries;
}

async function getIndex(): Promise<{ pagesDir: string; entries: IndexEntry[] }> {
  const pagesDir = await getPagesDir();
  const now = Date.now();
  const ttl = process.env.NODE_ENV === "production" ? 60_000 : 500; // dev: refresh frequente

  if (_cache && _cache.pagesDir === pagesDir && now - _cache.at < ttl) {
    return { pagesDir: _cache.pagesDir, entries: _cache.entries };
  }

  const entries = (await exists(pagesDir)) ? await buildIndex(pagesDir) : [];
  _cache = { at: now, pagesDir, entries };
  return { pagesDir, entries };
}

export async function listAllRoutes(): Promise<string[][]> {
  const { entries } = await getIndex();
  return entries.map((e) => (e.slug ? e.slug.split("/") : []));
}

export async function getPageBySlugParts(slugParts: string[]): Promise<PageSchema | null> {
  const slug = normalizeSlug(slugParts.join("/"));
  const { entries } = await getIndex();

  const match = entries.find((e) => e.slug === slug);
  if (!match) return null;

  const raw = await fs.readFile(match.filePath, "utf8");
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error(`[pages] Invalid JSON in: ${match.filePath}`);
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;

  // iniettiamo lo slug se manca (utile in runtime)
  if (typeof parsed.slug !== "string") parsed.slug = slug;

  return parsed as PageSchema;
}
