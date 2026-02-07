// lib/packages/index.ts
// Helper functions per il sistema pacchetti

import { promises as fs } from "fs";
import path from "path";
import type {
  Package,
  PackagesSectionConfig,
} from "./types";

const PACKAGES_PATH = path.join(process.cwd(), "content", "packages");
const ITEMS_PATH = path.join(PACKAGES_PATH, "items");

/**
 * Legge tutti i file JSON da una directory
 */
async function readJsonFiles<T>(dirPath: string): Promise<T[]> {
  try {
    await fs.access(dirPath);
    const files = await fs.readdir(dirPath);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(dirPath, file), "utf-8");
        return JSON.parse(content) as T;
      })
    );

    return items;
  } catch {
    return [];
  }
}

/**
 * Ottiene tutti i pacchetti pubblicati
 */
export async function getAllPackages(): Promise<Package[]> {
  const packages = await readJsonFiles<Package>(ITEMS_PATH);

  const published = packages.filter(
    (p) => p.status === "published" || p.status === undefined
  );

  return published.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/**
 * Ottiene un singolo pacchetto per slug
 */
export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const packages = await getAllPackages();
  return packages.find((p) => p.slug === slug) ?? null;
}

/**
 * Ottiene tutti gli slug per la generazione statica
 */
export async function getAllPackageSlugs(): Promise<string[]> {
  const packages = await getAllPackages();
  return packages.map((p) => p.slug);
}

/**
 * Ottiene i pacchetti filtrati secondo la configurazione
 */
export async function getPackagesForSection(
  config: PackagesSectionConfig
): Promise<Package[]> {
  let packages = await getAllPackages();

  // Escludi pacchetti specifici
  if (config.exclude?.length) {
    packages = packages.filter((p) => !config.exclude?.includes(p.slug));
  }

  // Limita il numero
  if (config.limit && config.limit > 0) {
    packages = packages.slice(0, config.limit);
  }

  return packages;
}

/**
 * Ottiene il pacchetto evidenziato/consigliato
 */
export async function getHighlightedPackage(): Promise<Package | null> {
  const packages = await getAllPackages();
  return packages.find((p) => p.highlighted) ?? null;
}
