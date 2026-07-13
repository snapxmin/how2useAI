import fs from "fs";
import path from "path";
import type { GuideScene } from "./scenes";

export type CurriculumPhase = "7d" | "14d" | "30d";
export type CurriculumStatus = "pending" | "published" | "skipped";

export interface CurriculumArticle {
  slug: string;
  title: string;
  description: string;
  day: number;
  phase: CurriculumPhase;
  level: "入门" | "进阶" | "精通";
  scene: GuideScene;
  tags: string[];
  tools: string[];
  status: CurriculumStatus;
  publishedSlug?: string;
  outline?: string[];
}

export interface DeveloperCurriculum {
  version: number;
  role: "developer";
  articlesPerDay: number;
  schedule: {
    time: string;
    timezone: string;
    cronUtc: string;
  };
  totalArticles: number;
  articles: CurriculumArticle[];
}

const curriculumPath = path.join(
  process.cwd(),
  "content/guides/developer-curriculum.json"
);

export function getDeveloperCurriculum(): DeveloperCurriculum {
  if (!fs.existsSync(curriculumPath)) {
    throw new Error("Developer curriculum not found");
  }
  return JSON.parse(
    fs.readFileSync(curriculumPath, "utf8")
  ) as DeveloperCurriculum;
}

export function getPublishedGuideSlugs(): Set<string> {
  const guidesDir = path.join(process.cwd(), "content/guides");
  if (!fs.existsSync(guidesDir)) {
    return new Set();
  }
  return new Set(
    fs
      .readdirSync(guidesDir)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => name.replace(/\.mdx$/, ""))
  );
}

export function syncCurriculumWithPublishedGuides(): CurriculumArticle[] {
  const curriculum = getDeveloperCurriculum();
  const publishedSlugs = getPublishedGuideSlugs();
  const newlyPublished: CurriculumArticle[] = [];

  for (const article of curriculum.articles) {
    if (article.status === "published") {
      continue;
    }
    if (publishedSlugs.has(article.slug)) {
      article.status = "published";
      article.publishedSlug = article.slug;
      newlyPublished.push(article);
    }
  }

  return newlyPublished;
}

export function getNextPendingArticles(
  count = 3,
  options?: { day?: number; phase?: CurriculumPhase }
): CurriculumArticle[] {
  const curriculum = getDeveloperCurriculum();
  let pending = curriculum.articles.filter((a) => a.status === "pending");

  if (options?.day !== undefined) {
    pending = pending.filter((a) => a.day === options.day);
  }
  if (options?.phase) {
    pending = pending.filter((a) => a.phase === options.phase);
  }

  return pending.slice(0, count);
}

export function getCurriculumProgress(): {
  total: number;
  published: number;
  pending: number;
  percentComplete: number;
  currentDay: number;
  currentPhase: CurriculumPhase;
} {
  const curriculum = getDeveloperCurriculum();
  const published = curriculum.articles.filter(
    (a) => a.status === "published"
  ).length;
  const pending = curriculum.articles.filter(
    (a) => a.status === "pending"
  ).length;
  const next = getNextPendingArticles(1)[0];

  return {
    total: curriculum.totalArticles,
    published,
    pending,
    percentComplete: Math.round((published / curriculum.totalArticles) * 100),
    currentDay: next?.day ?? 30,
    currentPhase: next?.phase ?? "30d",
  };
}

export function markArticlePublished(
  slug: string,
  publishedSlug?: string
): CurriculumArticle | null {
  const curriculum = getDeveloperCurriculum();
  const article = curriculum.articles.find((a) => a.slug === slug);
  if (!article) {
    return null;
  }

  article.status = "published";
  article.publishedSlug = publishedSlug ?? slug;
  fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2) + "\n");
  return article;
}
