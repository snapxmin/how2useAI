import type { GuideScene } from "./scenes";

export interface GuideFrontmatter {
  title: string;
  description: string;
  role: "workplace" | "developer" | "creator" | "enterprise" | "general";
  scene: GuideScene;
  date: string;
  updated?: string;
  tags: string[];
  featured?: boolean;
}

export interface Guide {
  slug: string;
  frontmatter: GuideFrontmatter;
  content: string;
}

export interface LessonFrontmatter {
  title: string;
  description: string;
  module: number;
  moduleTitle: string;
  order: number;
  duration: number;
  prerequisites: string[];
  objectives: string[];
}

export interface Lesson {
  slug: string;
  frontmatter: LessonFrontmatter;
  content: string;
}

export interface CourseModule {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface LessonTocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: "free" | "freemium" | "paid";
  url: string;
  roles: string[];
  featured?: boolean;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  role: string;
  category: string;
  content: string;
  tags: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  date: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

export type InsightType = "技术路线" | "产品观察" | "能力对比" | "行业趋势";

export interface InsightFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  insightType: InsightType;
  companies: string[];
  products: string[];
  tags: string[];
  readingTime: number;
  featured?: boolean;
  heroTheme: "navy" | "indigo" | "slate" | "amber";
}

export interface Insight {
  slug: string;
  frontmatter: InsightFrontmatter;
  content: string;
}

export interface WeeklyTopicConfig {
  title: string;
  description: string;
  insightSlugs: string[];
  newsIds: string[];
  guideSlugs: string[];
}

export interface NewsFeaturedConfig {
  heroInsightSlug: string;
  insightSlugs: string[];
  weeklyTopic?: WeeklyTopicConfig;
}

export type ColumnTopic =
  | "AI4SE 概览"
  | "AIOps 智能运维"
  | "平台工程"
  | "CI/CD 智能化"
  | "可观测性"
  | "治理与安全";

export interface ColumnConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  topics: ColumnTopic[];
  featuredArticleSlug?: string;
  heroTheme: "violet" | "indigo" | "emerald" | "slate";
}

export interface ColumnArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  topic: ColumnTopic;
  episode?: number;
  tags: string[];
  readingTime: number;
  featured?: boolean;
}

export interface ColumnArticle {
  columnId: string;
  slug: string;
  frontmatter: ColumnArticleFrontmatter;
  content: string;
}
