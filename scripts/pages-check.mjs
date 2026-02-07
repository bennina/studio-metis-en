// scripts/pages-check.mjs
import { promises as fs } from "node:fs";
import path from "node:path";

const ANSI = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function logInfo(msg) {
  console.log(`${ANSI.cyan}ℹ${ANSI.reset} ${msg}`);
}
function logOk(msg) {
  console.log(`${ANSI.green}✔${ANSI.reset} ${msg}`);
}
function logWarn(msg) {
  console.warn(`${ANSI.yellow}⚠${ANSI.reset} ${msg}`);
}
function logErr(msg) {
  console.error(`${ANSI.red}✖${ANSI.reset} ${msg}`);
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.isFile() && e.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function normalizeSlug(slug) {
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

function slugFromPath(pagesDir, absFile) {
  const rel = path.relative(pagesDir, absFile).replace(/\\/g, "/");
  const noExt = rel.replace(/\.json$/, "");
  const cleaned = noExt.endsWith("/index") ? noExt.replace(/\/index$/, "") : noExt;
  return cleaned === "index" ? "" : cleaned;
}

function isSlugValid(slug) {
  if (slug === "") return true;
  if (slug.includes(" ") || slug.includes("?") || slug.includes("#")) return false;
  if (slug.includes("//")) return false;
  return /^[a-z0-9\-\/]+$/i.test(slug);
}

(async function main() {
  const cwd = process.cwd();

  // Preferisci content/pages, altrimenti schema/pages; override con PAGES_DIR=...
  const preferred = process.env.PAGES_DIR
    ? path.join(cwd, process.env.PAGES_DIR)
    : path.join(cwd, "content/pages");

  const fallback = path.join(cwd, "schema/pages");

  const pagesDir = (await exists(preferred))
    ? preferred
    : (await exists(fallback))
    ? fallback
    : null;

  if (!pagesDir) {
    logErr(
      `Nessuna cartella pagine trovata. Crea "content/pages" oppure "schema/pages" oppure imposta PAGES_DIR=...`
    );
    process.exit(1);
  }

  logInfo(`Scansione pagine in: ${ANSI.dim}${pagesDir}${ANSI.reset}`);

  const files = await walk(pagesDir);
  if (!files.length) {
    logWarn("Nessun file .json trovato.");
    process.exit(0);
  }

  const invalidJson = [];
  const invalidSchema = [];
  const invalidSlugs = [];
  const slugMap = new Map(); // slug -> [files]

  for (const file of files) {
    const rel = path.relative(pagesDir, file).replace(/\\/g, "/");
    let parsed;

    try {
      const raw = await fs.readFile(file, "utf8");
      parsed = JSON.parse(raw);
    } catch (e) {
      invalidJson.push({ file: rel, error: String(e?.message ?? e) });
      continue;
    }

    if (!parsed || typeof parsed !== "object") {
      invalidSchema.push({ file: rel, error: "JSON non è un oggetto" });
      continue;
    }
    if (!Array.isArray(parsed.sections)) {
      invalidSchema.push({ file: rel, error: `Manca "sections" (array)` });
    }

    const slug =
      typeof parsed.slug === "string"
        ? normalizeSlug(parsed.slug)
        : normalizeSlug(slugFromPath(pagesDir, file));

    if (!isSlugValid(slug)) invalidSlugs.push({ file: rel, slug });

    const list = slugMap.get(slug) ?? [];
    list.push(rel);
    slugMap.set(slug, list);
  }

  const duplicates = [];
  for (const [slug, refs] of slugMap.entries()) {
    if (refs.length > 1) duplicates.push({ slug, files: refs });
  }

  let hasErrors = false;

  if (invalidJson.length) {
    hasErrors = true;
    logErr(`JSON invalidi: ${invalidJson.length}`);
    for (const it of invalidJson) {
      console.error(`  - ${it.file}\n    ${ANSI.dim}${it.error}${ANSI.reset}`);
    }
  }

  if (invalidSchema.length) {
    hasErrors = true;
    logErr(`Struttura pagina non valida: ${invalidSchema.length}`);
    for (const it of invalidSchema) console.error(`  - ${it.file}: ${it.error}`);
  }

  if (invalidSlugs.length) {
    hasErrors = true;
    logErr(`Slug non validi: ${invalidSlugs.length}`);
    for (const it of invalidSlugs) console.error(`  - ${it.file}: slug="${it.slug}"`);
  }

  if (duplicates.length) {
    hasErrors = true;
    logErr(`Slug duplicati: ${duplicates.length}`);
    for (const d of duplicates) {
      console.error(`  - slug="${d.slug}"`);
      for (const f of d.files) console.error(`    • ${f}`);
    }
  }

  if (!hasErrors) {
    logOk(`Tutto ok! ${files.length} file controllati, nessun duplicato/errore.`);
    process.exit(0);
  }

  process.exit(1);
})();
