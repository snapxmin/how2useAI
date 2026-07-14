import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  ColumnArticle,
  ColumnArticleFrontmatter,
  ColumnConfig,
  ColumnTopic,
} from "./types";

const columnsDirectory = path.join(process.cwd(), "content/columns");

const columnTopics: ColumnTopic[] = [
  "AI4SE 概览",
  "AIOps 智能运维",
  "平台工程",
  "CI/CD 智能化",
  "可观测性",
  "治理与安全",
];

function requireString(data: Record<string, unknown>, key: string, slug: string) {
  if (typeof data[key] !== "string" || data[key] === "") {
    throw new Error(`Column article "${slug}" has invalid ${key}`);
  }
}

export function parseColumnArticle(
  columnId: string,
  slug: string,
  source: string
): ColumnArticle {
  const { data, content } = matter(source);
  const raw = data as Record<string, unknown>;
  if (raw.date instanceof Date) raw.date = raw.date.toISOString().slice(0, 10);
  if (raw.updated instanceof Date) {
    raw.updated = raw.updated.toISOString().slice(0, 10);
  }

  ["title", "description", "date", "topic"].forEach((key) =>
    requireString(raw, key, slug)
  );
  if (
    !Array.isArray(raw.tags) ||
    !(raw.tags as unknown[]).every((item) => typeof item === "string")
  ) {
    throw new Error(`Column article "${slug}" has invalid tags`);
  }
  if (
    typeof raw.readingTime !== "number" ||
    raw.readingTime <= 0 ||
    !columnTopics.includes(raw.topic as ColumnTopic) ||
    Number.isNaN(new Date(raw.date as string).getTime())
  ) {
    throw new Error(`Column article "${slug}" has invalid metadata`);
  }
  if (raw.episode !== undefined && typeof raw.episode !== "number") {
    throw new Error(`Column article "${slug}" has invalid episode`);
  }

  return {
    columnId,
    slug,
    frontmatter: raw as unknown as ColumnArticleFrontmatter,
    content,
  };
}

export function sortColumnArticlesByDate(
  items: ColumnArticle[]
): ColumnArticle[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getAllColumnConfigs(): ColumnConfig[] {
  if (!fs.existsSync(columnsDirectory)) return [];

  return fs
    .readdirSync(columnsDirectory)
    .filter((name) => name.endsWith(".json"))
    .map((fileName) => {
      const config = JSON.parse(
        fs.readFileSync(path.join(columnsDirectory, fileName), "utf8")
      ) as ColumnConfig;
      return config;
    });
}

export function getColumnConfig(columnId: string): ColumnConfig | null {
  const configPath = path.join(columnsDirectory, `${columnId}.json`);
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf8")) as ColumnConfig;
}

export function getAllColumnIds(): string[] {
  return getAllColumnConfigs().map((config) => config.id);
}

function getArticlesDirectory(columnId: string): string {
  return path.join(columnsDirectory, columnId, "articles");
}

export function getColumnArticles(columnId: string): ColumnArticle[] {
  const articlesDir = getArticlesDirectory(columnId);
  if (!fs.existsSync(articlesDir)) return [];

  const slugs = new Set<string>();
  const articles = fs
    .readdirSync(articlesDir)
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      if (slugs.has(slug)) {
        throw new Error(`Duplicate column article slug: ${slug}`);
      }
      slugs.add(slug);
      return parseColumnArticle(
        columnId,
        slug,
        fs.readFileSync(path.join(articlesDir, fileName), "utf8")
      );
    });

  return sortColumnArticlesByDate(articles);
}

export function getColumnArticleBySlug(
  columnId: string,
  slug: string
): ColumnArticle | null {
  const fullPath = path.join(getArticlesDirectory(columnId), `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  return parseColumnArticle(
    columnId,
    slug,
    fs.readFileSync(fullPath, "utf8")
  );
}

export function getAllColumnArticleParams(): { column: string; slug: string }[] {
  return getAllColumnIds().flatMap((columnId) =>
    getColumnArticles(columnId).map((article) => ({
      column: columnId,
      slug: article.slug,
    }))
  );
}

export function getFeaturedColumnArticle(
  columnId: string
): ColumnArticle | null {
  const config = getColumnConfig(columnId);
  const articles = getColumnArticles(columnId);
  if (articles.length === 0) return null;

  if (config?.featuredArticleSlug) {
    const featured = articles.find(
      (item) => item.slug === config.featuredArticleSlug
    );
    if (featured) return featured;
  }

  return (
    articles.find((item) => item.frontmatter.featured) ?? articles[0] ?? null
  );
}

export function groupArticlesByTopic(
  articles: ColumnArticle[]
): { topic: ColumnTopic; articles: ColumnArticle[] }[] {
  const grouped = new Map<ColumnTopic, ColumnArticle[]>();
  for (const article of articles) {
    const topic = article.frontmatter.topic;
    const existing = grouped.get(topic) ?? [];
    existing.push(article);
    grouped.set(topic, existing);
  }
  return columnTopics
    .filter((topic) => grouped.has(topic))
    .map((topic) => ({
      topic,
      articles: grouped.get(topic) ?? [],
    }));
}
