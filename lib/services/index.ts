// lib/services/index.ts
// Helper functions per il sistema servizi

import { promises as fs } from "fs";
import path from "path";
import type {
  Service,
  ServiceCategory,
  ServiceWithCategory,
  ServicesSectionConfig,
} from "./types";

const SERVICES_PATH = path.join(process.cwd(), "content", "services");
const CATEGORIES_PATH = path.join(SERVICES_PATH, "categories");
const ITEMS_PATH = path.join(SERVICES_PATH, "items");

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
 * Ottiene tutte le categorie servizi
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const categories = await readJsonFiles<ServiceCategory>(CATEGORIES_PATH);
  return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Ottiene una categoria per slug
 */
export async function getServiceCategoryBySlug(
  slug: string
): Promise<ServiceCategory | null> {
  const categories = await getServiceCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

/**
 * Ottiene tutti i servizi pubblicati
 */
export async function getAllServices(): Promise<Service[]> {
  const services = await readJsonFiles<Service>(ITEMS_PATH);

  const published = services.filter(
    (s) => s.status === "published" || s.status === undefined
  );

  return published.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/**
 * Ottiene i servizi per categoria
 */
export async function getServicesByCategory(
  categorySlug: string
): Promise<Service[]> {
  const services = await getAllServices();
  return services.filter((s) => s.category === categorySlug);
}

/**
 * Ottiene un singolo servizio per slug
 */
export async function getServiceBySlug(
  slug: string
): Promise<ServiceWithCategory | null> {
  const services = await getAllServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) return null;

  const category = await getServiceCategoryBySlug(service.category);
  if (!category) return null;

  return {
    ...service,
    categoryData: category,
  };
}

/**
 * Ottiene i servizi con le categorie popolate
 */
export async function getServicesWithCategories(): Promise<
  ServiceWithCategory[]
> {
  const [services, categories] = await Promise.all([
    getAllServices(),
    getServiceCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  return services
    .map((service) => {
      const categoryData = categoryMap.get(service.category);
      if (!categoryData) return null;
      return { ...service, categoryData };
    })
    .filter((s): s is ServiceWithCategory => s !== null);
}

/**
 * Ottiene i servizi correlati
 */
export async function getRelatedServices(
  currentService: Service,
  limit: number = 3
): Promise<Service[]> {
  const services = await getAllServices();

  // Prima cerca servizi della stessa categoria
  let related = services.filter(
    (s) =>
      s.category === currentService.category && s.slug !== currentService.slug
  );

  // Se non abbastanza, aggiungi altri servizi
  if (related.length < limit) {
    const others = services.filter(
      (s) =>
        s.slug !== currentService.slug && !related.find((r) => r.slug === s.slug)
    );
    related = [...related, ...others];
  }

  return related.slice(0, limit);
}

/**
 * Ottiene tutti gli slug per la generazione statica
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  const services = await getAllServices();
  return services.map((s) => s.slug);
}

/**
 * Ottiene i servizi filtrati secondo la configurazione
 */
export async function getServicesForSection(
  config: ServicesSectionConfig
): Promise<ServiceWithCategory[]> {
  let services = await getServicesWithCategories();

  // Filtra per categoria se specificata
  if (config.category) {
    services = services.filter((s) => s.category === config.category);
  }

  // Escludi servizi specifici
  if (config.exclude?.length) {
    services = services.filter((s) => !config.exclude?.includes(s.slug));
  }

  // Limita il numero
  if (config.limit && config.limit > 0) {
    services = services.slice(0, config.limit);
  }

  return services;
}
