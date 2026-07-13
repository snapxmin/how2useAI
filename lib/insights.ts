import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Insight,
  InsightFrontmatter,
  InsightType,
  NewsFeaturedConfig,
} from "./types";

const insightsDirectory = path.join(process.cwd(), "content/news/insights");
const featuredPath = path.join(process.cwd(), "content/news/featured.json");
const insightTypes: InsightType[] = [
  "技术路线",
  "产品观察",
  "能力对比",
  "行业趋势",
];
const heroThemes: InsightFrontmatter["heroTheme"][] = [
  "navy",
  "indigo",
  "slate",
  "amber",
];

function requireString(data: Record<string, unknown>, key: string, slug: string) {
  if (typeof data[key] !== "string" || data[key] === "") {
    throw new Error(`Insight "${slug}" has invalid ${key}`);
  }
}

export function parseInsight(slug: string, source: string): Insight {
  const { data, content } = matter(source);
  const raw = data as Record<string, unknown>;
  if (raw.date instanceof Date) raw.date = raw.date.toISOString().slice(0, 10);
  if (raw.updated instanceof Date) {
    raw.updated = raw.updated.toISOString().slice(0, 10);
  }

  ["title", "description", "date", "category", "insightType", "heroTheme"].forEach(
    (key) => requireString(raw, key, slug)
  );
  ["companies", "products", "tags"].forEach((key) => {
    if (
      !Array.isArray(raw[key]) ||
      !(raw[key] as unknown[]).every((item) => typeof item === "string")
    ) {
      throw new Error(`Insight "${slug}" has invalid ${key}`);
    }
  });
  if (
    typeof raw.readingTime !== "number" ||
    raw.readingTime <= 0 ||
    !insightTypes.includes(raw.insightType as InsightType) ||
    !heroThemes.includes(raw.heroTheme as InsightFrontmatter["heroTheme"]) ||
    Number.isNaN(new Date(raw.date as string).getTime())
  ) {
    throw new Error(`Insight "${slug}" has invalid metadata`);
  }

  return {
    slug,
    frontmatter: raw as unknown as InsightFrontmatter,
    content,
  };
}

export function sortInsightsByDate(items: Insight[]): Insight[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getAllInsights(): Insight[] {
  if (!fs.existsSync(insightsDirectory)) return [];

  const slugs = new Set<string>();
  const insights = fs
    .readdirSync(insightsDirectory)
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      if (slugs.has(slug)) throw new Error(`Duplicate insight slug: ${slug}`);
      slugs.add(slug);
      return parseInsight(
        slug,
        fs.readFileSync(path.join(insightsDirectory, fileName), "utf8")
      );
    });

  return sortInsightsByDate(insights);
}

export function getInsightBySlug(slug: string): Insight | null {
  const fullPath = path.join(insightsDirectory, `${slug}.mdx`);
  return fs.existsSync(fullPath)
    ? parseInsight(slug, fs.readFileSync(fullPath, "utf8"))
    : null;
}

export function getAllInsightSlugs(): string[] {
  return getAllInsights().map((item) => item.slug);
}

export function getFeaturedConfig(): NewsFeaturedConfig {
  if (!fs.existsSync(featuredPath)) {
    return { heroInsightSlug: "", insightSlugs: [] };
  }
  return JSON.parse(fs.readFileSync(featuredPath, "utf8")) as NewsFeaturedConfig;
}

export function resolveFeaturedInsights(
  insights: Insight[],
  config: NewsFeaturedConfig
): { hero: Insight | null; insights: Insight[] } {
  if (insights.length === 0) return { hero: null, insights: [] };

  const sorted = sortInsightsByDate(insights);
  const bySlug = new Map(insights.map((item) => [item.slug, item]));
  const hero =
    bySlug.get(config.heroInsightSlug) ??
    sorted.find((item) => item.frontmatter.featured) ??
    sorted[0];
  const selected = config.insightSlugs
    .map((slug) => bySlug.get(slug))
    .filter((item): item is Insight => Boolean(item))
    .filter((item) => item.slug !== hero.slug);
  const fallback = sorted.filter(
    (item) =>
      item.slug !== hero.slug &&
      !selected.some((selectedItem) => selectedItem.slug === item.slug)
  );

  return { hero, insights: [...selected, ...fallback].slice(0, 3) };
}
