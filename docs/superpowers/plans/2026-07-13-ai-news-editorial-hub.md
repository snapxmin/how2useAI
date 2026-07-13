# AI News Editorial Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/news` into an editorial AI information hub with a featured internal analysis, time-sensitive external news, company/product explainers, a weekly topic, and responsive browsing.

**Architecture:** Keep external news in static JSON and add internal MDX insights plus a small featured-content JSON file. Server-side loaders validate and assemble a view model; focused server components render each section, while `/news/insights/[slug]` reuses the existing MDX compiler.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, gray-matter, next-mdx-remote, Vitest

---

## File map

### Data and types

- Modify `lib/types.ts`: define insight and featured-topic contracts.
- Modify `lib/news.ts`: add category filtering, URL validation, breaking-news selection, and safe sorting.
- Create `lib/news.test.ts`: test sorting, category filtering, invalid categories, URL filtering, and empty input.
- Create `lib/insights.ts`: load and validate MDX insights and featured configuration.
- Create `lib/insights.test.ts`: test metadata validation, sorting, slug lookup, featured fallbacks, and invalid references.
- Create `content/news/featured.json`: select the hero, three explainer cards, and the weekly topic.
- Create `content/news/insights/*.mdx`: provide four launch-ready internal analyses.

### UI and routes

- Create `components/news/NewsCategoryNav.tsx`: shareable server-rendered category navigation.
- Create `components/news/NewsHero.tsx`: render the primary internal analysis.
- Create `components/news/BreakingNews.tsx`: render the latest external updates.
- Create `components/news/InsightGrid.tsx`: render company/product explainer cards.
- Create `components/news/NewsFeed.tsx`: render the full external news list and empty state.
- Create `components/news/WeeklyTopic.tsx`: render a configured cross-content topic.
- Modify `app/news/page.tsx`: assemble the editorial view model and responsive section layout.
- Create `app/news/insights/[slug]/page.tsx`: render insight metadata, MDX, related insights, subscription CTA, and Article JSON-LD.
- Modify `app/sitemap.ts`: include insight URLs.

### Verification

- Modify `lib/news-content.test.ts`: retain source-integrity checks while removing coupling to the old page copy.
- Verify with Vitest, TypeScript/ESLint, production build, and responsive browser review.

## Task 1: Add insight contracts and news query behavior

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/news.ts`
- Create: `lib/news.test.ts`

- [ ] **Step 1: Write failing news query tests**

Create `lib/news.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { NewsItem } from "./types";
import {
  filterNewsByCategory,
  getBreakingNewsFromItems,
  getNewsCategoriesFromItems,
  sortNewsByDate,
} from "./news";

const items: NewsItem[] = [
  {
    id: "older",
    title: "Older",
    summary: "Older summary",
    source: "Source",
    url: "https://example.com/older",
    date: "2026-07-01",
    category: "大模型",
    tags: ["模型"],
  },
  {
    id: "newer",
    title: "Newer",
    summary: "Newer summary",
    source: "Source",
    url: "https://example.com/newer",
    date: "2026-07-03",
    category: "AI产品",
    tags: ["产品"],
  },
  {
    id: "invalid-url",
    title: "Invalid",
    summary: "Invalid summary",
    source: "Source",
    url: "javascript:alert(1)",
    date: "2026-07-04",
    category: "AI产品",
    tags: ["产品"],
  },
];

describe("news queries", () => {
  it("sorts newest first without mutating the input", () => {
    const sorted = sortNewsByDate(items);
    expect(sorted.map((item) => item.id)).toEqual(["invalid-url", "newer", "older"]);
    expect(items[0].id).toBe("older");
  });

  it("returns all news for an unknown or missing category", () => {
    expect(filterNewsByCategory(items, undefined)).toHaveLength(3);
    expect(filterNewsByCategory(items, "不存在")).toHaveLength(3);
  });

  it("filters a known category and exposes stable category links", () => {
    expect(filterNewsByCategory(items, "大模型").map((item) => item.id)).toEqual(["older"]);
    expect(getNewsCategoriesFromItems(items)).toEqual(["全部", "大模型", "AI产品"]);
  });

  it("excludes unsafe URLs from breaking news", () => {
    expect(getBreakingNewsFromItems(items, 5).map((item) => item.id)).toEqual([
      "newer",
      "older",
    ]);
  });
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
npx vitest run lib/news.test.ts
```

Expected: FAIL because the four query helpers do not exist.

- [ ] **Step 3: Add insight and featured-content types**

Append to `lib/types.ts`:

```ts
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
```

- [ ] **Step 4: Implement pure news query helpers**

Replace `lib/news.ts` with:

```ts
import fs from "fs";
import path from "path";
import type { NewsItem } from "./types";

const newsPath = path.join(process.cwd(), "content/news/news.json");

export function isSafeExternalUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function sortNewsByDate(items: NewsItem[]): NewsItem[] {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsCategoriesFromItems(items: NewsItem[]): string[] {
  return ["全部", ...Array.from(new Set(items.map((item) => item.category)))];
}

export function filterNewsByCategory(
  items: NewsItem[],
  category?: string
): NewsItem[] {
  const categories = getNewsCategoriesFromItems(items);
  if (!category || category === "全部" || !categories.includes(category)) {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function getBreakingNewsFromItems(
  items: NewsItem[],
  limit = 4
): NewsItem[] {
  return sortNewsByDate(items.filter((item) => isSafeExternalUrl(item.url))).slice(
    0,
    limit
  );
}

export function getAllNews(): NewsItem[] {
  if (!fs.existsSync(newsPath)) return [];
  return sortNewsByDate(
    JSON.parse(fs.readFileSync(newsPath, "utf8")) as NewsItem[]
  );
}

export function getFeaturedNews(limit = 3): NewsItem[] {
  const news = getAllNews();
  const featured = news.filter((item) => item.featured);
  return (featured.length > 0 ? featured : news).slice(0, limit);
}

export function getNewsCategories(): string[] {
  return getNewsCategoriesFromItems(getAllNews());
}

export function getNewsByCategory(category?: string): NewsItem[] {
  return filterNewsByCategory(getAllNews(), category);
}

export function getBreakingNews(limit = 4): NewsItem[] {
  return getBreakingNewsFromItems(getAllNews(), limit);
}
```

- [ ] **Step 5: Run the focused test**

Run:

```powershell
npx vitest run lib/news.test.ts
```

Expected: PASS, 4 tests passed.

## Task 2: Build the insight loader and featured fallback rules

**Files:**
- Create: `lib/insights.ts`
- Create: `lib/insights.test.ts`

- [ ] **Step 1: Write failing loader tests against pure functions**

Create `lib/insights.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Insight, NewsFeaturedConfig } from "./types";
import {
  parseInsight,
  resolveFeaturedInsights,
  sortInsightsByDate,
} from "./insights";

const insights: Insight[] = [
  {
    slug: "older",
    frontmatter: {
      title: "Older",
      description: "Older insight",
      date: "2026-07-01",
      category: "大模型",
      insightType: "技术路线",
      companies: ["A"],
      products: ["A1"],
      tags: ["模型"],
      readingTime: 6,
      featured: true,
      heroTheme: "navy",
    },
    content: "Content",
  },
  {
    slug: "newer",
    frontmatter: {
      title: "Newer",
      description: "Newer insight",
      date: "2026-07-03",
      category: "AI产品",
      insightType: "产品观察",
      companies: ["B"],
      products: ["B1"],
      tags: ["产品"],
      readingTime: 5,
      heroTheme: "indigo",
    },
    content: "Content",
  },
];

describe("insight loader", () => {
  it("parses valid frontmatter and rejects missing required fields", () => {
    const source = `---
title: Valid
description: Valid description
date: 2026-07-03
category: 大模型
insightType: 技术路线
companies: [OpenAI]
products: [GPT]
tags: [模型]
readingTime: 6
heroTheme: navy
---
Body`;
    expect(parseInsight("valid", source).frontmatter.title).toBe("Valid");
    expect(() => parseInsight("invalid", "---\ntitle: Invalid\n---\nBody")).toThrow(
      "invalid"
    );
  });

  it("sorts newest first", () => {
    expect(sortInsightsByDate(insights).map((item) => item.slug)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("falls back when configured slugs do not exist", () => {
    const config: NewsFeaturedConfig = {
      heroInsightSlug: "missing",
      insightSlugs: ["missing", "newer"],
    };
    const resolved = resolveFeaturedInsights(insights, config);
    expect(resolved.hero.slug).toBe("older");
    expect(resolved.insights.map((item) => item.slug)).toEqual(["newer"]);
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```powershell
npx vitest run lib/insights.test.ts
```

Expected: FAIL because `lib/insights.ts` does not exist.

- [ ] **Step 3: Implement loading, validation, sorting, and fallback**

Create `lib/insights.ts`:

```ts
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
const heroThemes = ["navy", "indigo", "slate", "amber"];

function requireString(data: Record<string, unknown>, key: string, slug: string) {
  if (typeof data[key] !== "string" || data[key] === "") {
    throw new Error(`Insight "${slug}" has invalid ${key}`);
  }
}

export function parseInsight(slug: string, source: string): Insight {
  const { data, content } = matter(source);
  const raw = data as Record<string, unknown>;
  ["title", "description", "date", "category", "insightType", "heroTheme"].forEach(
    (key) => requireString(raw, key, slug)
  );
  ["companies", "products", "tags"].forEach((key) => {
    if (!Array.isArray(raw[key])) {
      throw new Error(`Insight "${slug}" has invalid ${key}`);
    }
  });
  if (
    typeof raw.readingTime !== "number" ||
    raw.readingTime <= 0 ||
    !insightTypes.includes(raw.insightType as InsightType) ||
    !heroThemes.includes(raw.heroTheme as string) ||
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
) {
  if (insights.length === 0) {
    return { hero: null, insights: [] as Insight[] };
  }
  const bySlug = new Map(insights.map((item) => [item.slug, item]));
  const configuredHero = bySlug.get(config.heroInsightSlug);
  const hero =
    configuredHero ??
    insights.find((item) => item.frontmatter.featured) ??
    sortInsightsByDate(insights)[0];
  const selected = config.insightSlugs
    .map((slug) => bySlug.get(slug))
    .filter((item): item is Insight => Boolean(item))
    .filter((item) => item.slug !== hero.slug);
  const fallback = sortInsightsByDate(insights).filter(
    (item) =>
      item.slug !== hero.slug &&
      !selected.some((selectedItem) => selectedItem.slug === item.slug)
  );
  return { hero, insights: [...selected, ...fallback].slice(0, 3) };
}
```

- [ ] **Step 4: Run the loader tests**

Run:

```powershell
npx vitest run lib/insights.test.ts
```

Expected: PASS, 3 tests passed.

## Task 3: Add launch content and featured configuration

**Files:**
- Create: `content/news/featured.json`
- Create: `content/news/insights/gpt-5-6-agent-system.mdx`
- Create: `content/news/insights/chatgpt-work-product-shift.mdx`
- Create: `content/news/insights/meta-muse-multimodal-stack.mdx`
- Create: `content/news/insights/china-open-model-scale.mdx`

- [ ] **Step 1: Add deterministic featured configuration**

Create `content/news/featured.json`:

```json
{
  "heroInsightSlug": "gpt-5-6-agent-system",
  "insightSlugs": [
    "chatgpt-work-product-shift",
    "meta-muse-multimodal-stack",
    "china-open-model-scale"
  ],
  "weeklyTopic": {
    "title": "AI 产品进入 Agent 工作流阶段",
    "description": "从模型工具调用到跨应用执行，理解大厂如何把 AI 从对话框推进到完整工作流。",
    "insightSlugs": [
      "gpt-5-6-agent-system",
      "chatgpt-work-product-shift"
    ],
    "newsIds": [
      "openai-gpt-5-6-general-availability",
      "openai-chatgpt-work",
      "meta-muse-spark-1-1"
    ],
    "guideSlugs": []
  }
}
```

- [ ] **Step 2: Add four concise, source-grounded MDX analyses**

Each file must contain valid frontmatter matching `InsightFrontmatter`, followed by these four required sections: `发生了什么`, `为什么重要`, `关键技术或产品变化`, `对使用者的影响`. Use only claims already supported by `content/news/news.json`; do not invent benchmarks or adoption numbers.

Use these exact metadata values:

```yaml
# gpt-5-6-agent-system.mdx
title: GPT-5.6 的重点不是更会回答，而是更会组织工作
description: 从 ultra 模式与多智能体协作看旗舰模型如何转向复杂任务执行。
date: 2026-07-13
category: 大模型
insightType: 技术路线
companies: [OpenAI]
products: [GPT-5.6, Codex, ChatGPT]
tags: [Agent, 多智能体, 工具调用]
readingTime: 7
featured: true
heroTheme: navy

# chatgpt-work-product-shift.mdx
title: ChatGPT Work 正在把 AI 助手变成跨应用工作流
description: 拆解长时间任务、跨文件执行和完整交付物背后的产品变化。
date: 2026-07-12
category: AI产品
insightType: 产品观察
companies: [OpenAI]
products: [ChatGPT Work]
tags: [Agent, 办公效率, 工作流]
readingTime: 6
featured: true
heroTheme: indigo

# meta-muse-multimodal-stack.mdx
title: 从 Muse Spark 到 Muse Video，Meta 在补齐多模态 Agent 栈
description: 模型 API、图像编辑与原生音视频能力如何组合成可调用的生产工具。
date: 2026-07-11
category: AI产品
insightType: 能力对比
companies: [Meta]
products: [Muse Spark, Muse Image, Muse Video]
tags: [多模态, Agent, 生成式媒体]
readingTime: 6
featured: true
heroTheme: slate

# china-open-model-scale.mdx
title: 万亿参数不是终点：看懂国产开源模型的规模路线
description: 以 LongCat-2.0 与混元 Hy3 为例，理解 MoE、激活参数与 Agent 优化。
date: 2026-07-10
category: 开源
insightType: 技术路线
companies: [美团, 腾讯]
products: [LongCat-2.0, 混元 Hy3]
tags: [MoE, 开源模型, Agent]
readingTime: 7
featured: false
heroTheme: amber
```

- [ ] **Step 3: Verify all files load through the real filesystem path**

Extend `lib/insights.test.ts`:

```ts
import { getAllInsights, getFeaturedConfig } from "./insights";

it("loads four launch insights and valid featured references", () => {
  const loaded = getAllInsights();
  const config = getFeaturedConfig();
  const slugs = new Set(loaded.map((item) => item.slug));
  expect(loaded).toHaveLength(4);
  expect(slugs.has(config.heroInsightSlug)).toBe(true);
  expect(config.insightSlugs.every((slug) => slugs.has(slug))).toBe(true);
});
```

Run:

```powershell
npx vitest run lib/insights.test.ts
```

Expected: PASS, 4 tests passed.

## Task 4: Build the editorial portal components

**Files:**
- Create: `components/news/NewsCategoryNav.tsx`
- Create: `components/news/NewsHero.tsx`
- Create: `components/news/BreakingNews.tsx`
- Create: `components/news/InsightGrid.tsx`
- Create: `components/news/NewsFeed.tsx`
- Create: `components/news/WeeklyTopic.tsx`
- Modify: `app/news/page.tsx`

- [ ] **Step 1: Add focused presentational components**

Implement each component with a typed props interface and no filesystem access:

```ts
// Required public signatures
NewsCategoryNav(props: { categories: string[]; activeCategory: string }): JSX.Element
NewsHero(props: { insight: Insight | null }): JSX.Element | null
BreakingNews(props: { items: NewsItem[] }): JSX.Element
InsightGrid(props: { items: Insight[] }): JSX.Element | null
NewsFeed(props: { items: NewsItem[] }): JSX.Element
WeeklyTopic(props: {
  topic?: WeeklyTopicConfig;
  insights: Insight[];
  news: NewsItem[];
  guides: Guide[];
}): JSX.Element | null
```

Implementation requirements:

- `NewsCategoryNav` uses `Link` URLs `/news` and `/news?category=${encodeURIComponent(category)}`, `aria-current="page"` for the active item, horizontal overflow on mobile, and visible focus rings.
- `NewsHero` links to `/news/insights/${slug}`, uses `heroTheme` to select a static Tailwind class map, and displays `insightType`, title, description, company names, and reading time.
- `BreakingNews` renders up to four items with `<time dateTime>`, source, safe external-link attributes, and an empty-state message when no items exist.
- `InsightGrid` renders up to three internal links with type, title, description, company/product context, and reading time.
- `NewsFeed` uses a one-column editorial list rather than the old two-column card grid; each safe external item shows source, date, category, summary, tags, and an external-link icon. Unsafe URLs render as non-clickable articles.
- `WeeklyTopic` resolves configured slugs and IDs from the supplied arrays, hides itself when no topic exists, and renders linked internal insights, guides, and safe external news references.

- [ ] **Step 2: Assemble the server-rendered page**

Replace `app/news/page.tsx` so it:

```tsx
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/RelatedArticles";
import { BreakingNews } from "@/components/news/BreakingNews";
import { InsightGrid } from "@/components/news/InsightGrid";
import { NewsCategoryNav } from "@/components/news/NewsCategoryNav";
import { NewsFeed } from "@/components/news/NewsFeed";
import { NewsHero } from "@/components/news/NewsHero";
import { WeeklyTopic } from "@/components/news/WeeklyTopic";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getAllGuides } from "@/lib/guides";
import {
  getAllInsights,
  getFeaturedConfig,
  resolveFeaturedInsights,
} from "@/lib/insights";
import {
  filterNewsByCategory,
  getAllNews,
  getBreakingNewsFromItems,
  getNewsCategoriesFromItems,
} from "@/lib/news";

export const metadata: Metadata = {
  title: "AI 资讯与深度解读",
  description: "精选 AI 快讯、大厂关键技术、产品变化与行业趋势解读",
};

interface NewsPageProps {
  searchParams: { category?: string };
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  const allNews = getAllNews();
  const categories = getNewsCategoriesFromItems(allNews);
  const activeCategory = categories.includes(searchParams.category ?? "")
    ? searchParams.category!
    : "全部";
  const filteredNews = filterNewsByCategory(allNews, activeCategory);
  const allInsights = getAllInsights();
  const allGuides = getAllGuides();
  const config = getFeaturedConfig();
  const featured = resolveFeaturedInsights(allInsights, config);

  return (
    <>
      <main className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "资讯" }]} />
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              AI EDITORIAL
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              AI 资讯与深度解读
            </h1>
            <p className="mt-3 text-slate-600">
              不只追踪发生了什么，也解释大厂技术与产品为什么值得关注。
              当前内容截至 2026 年 7 月 13 日完成联网核验。
            </p>
          </div>
          <div className="mt-7">
            <NewsCategoryNav
              categories={categories}
              activeCategory={activeCategory}
            />
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
            <NewsHero insight={featured.hero} />
            <BreakingNews items={getBreakingNewsFromItems(allNews, 4)} />
          </div>
          <section className="mt-14">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-600">INSIGHTS</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  大厂技术与产品拆解
                </h2>
              </div>
            </div>
            <div className="mt-6">
              <InsightGrid items={featured.insights} />
            </div>
          </section>
          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
            <section>
              <h2 className="text-2xl font-bold text-slate-950">最新资讯</h2>
              <div className="mt-5">
                <NewsFeed items={filteredNews} />
              </div>
            </section>
            <aside>
              <WeeklyTopic
                topic={config.weeklyTopic}
                insights={allInsights}
                news={allNews}
                guides={allGuides}
              />
            </aside>
          </div>
          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            资讯优先采用官方公告及权威媒体并链接具体原文；未经可靠来源确认的传闻不予收录。
          </div>
        </div>
      </main>
      <section className="bg-slate-950 py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white">订阅每周 AI 精选</h2>
          <p className="mt-2 text-slate-300">
            把重要资讯、技术解读和实战建议一次读完。
          </p>
          <div className="mt-6">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
```

Use `max-w-6xl`, a `lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]` hero grid, a `lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]` lower grid, and single-column mobile flow. Keep the existing “截至 2026 年 7 月 13 日完成联网核验” disclosure.

- [ ] **Step 3: Remove obsolete card-grid coupling**

Stop importing `NewsGrid` from `components/NewsCard.tsx`. Leave `NewsCard.tsx` in place only if another module imports it; otherwise delete it after confirming with workspace search.

- [ ] **Step 4: Verify the portal compiles**

Run:

```powershell
npx tsc --noEmit
```

Expected: no TypeScript errors.

## Task 5: Add the internal insight article route

**Files:**
- Create: `app/news/insights/[slug]/page.tsx`

- [ ] **Step 1: Implement the static insight detail page**

Follow `app/guides/[slug]/page.tsx` and include:

```ts
export async function generateStaticParams() {
  return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const insight = getInsightBySlug(params.slug);
  if (!insight) return { title: "解读未找到" };
  return {
    title: insight.frontmatter.title,
    description: insight.frontmatter.description,
    keywords: insight.frontmatter.tags,
    openGraph: {
      title: insight.frontmatter.title,
      description: insight.frontmatter.description,
      type: "article",
      publishedTime: insight.frontmatter.date,
      modifiedTime:
        insight.frontmatter.updated ?? insight.frontmatter.date,
      tags: insight.frontmatter.tags,
    },
  };
}
```

The page must:

- call `notFound()` for an unknown slug;
- compile `insight.content` with `compileMdxContent`;
- render breadcrumbs for 首页 → AI 资讯 → current title;
- show insight type, date, updated date when present, reading time, companies, products, and tags;
- include Article JSON-LD using `siteConfig.name`;
- render MDX with the existing prose classes;
- show up to three related insights sharing a category or company;
- end with the existing `SubscribeForm`.

- [ ] **Step 2: Verify static route generation**

Run:

```powershell
npm run build
```

Expected: build output lists four `/news/insights/[slug]` static pages and `/news`.

## Task 6: Complete SEO and regression coverage

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `lib/news-content.test.ts`

- [ ] **Step 1: Add insight URLs to the sitemap**

Import `getAllInsights`, map each insight to:

```ts
{
  url: `${siteConfig.url}/news/insights/${insight.slug}`,
  lastModified: new Date(
    insight.frontmatter.updated ?? insight.frontmatter.date
  ),
  changeFrequency: "monthly" as const,
  priority: 0.75,
}
```

Append the resulting array to the sitemap return value.

- [ ] **Step 2: Decouple the existing content test from old layout copy**

In `lib/news-content.test.ts`, retain the 10-record, date-window, uniqueness, completeness, HTTPS, and three-featured assertions. Replace the page-source assertion with:

```ts
it("keeps editorial verification copy on the news page", () => {
  const pageSource = fs.readFileSync(pagePath, "utf8");
  expect(pageSource).toContain("截至 2026 年 7 月 13 日");
  expect(pageSource).toContain("联网核验");
  expect(pageSource).toContain("NewsCategoryNav");
  expect(pageSource).toContain("NewsHero");
  expect(pageSource).toContain("BreakingNews");
});
```

- [ ] **Step 3: Run the complete automated suite**

Run:

```powershell
npm test
```

Expected: every Vitest suite passes.

- [ ] **Step 4: Run lint and production build**

Run:

```powershell
npm run lint
npm run build
```

Expected: no ESLint errors and a successful production build.

- [ ] **Step 5: Perform responsive and accessibility review**

Run the local application and verify `/news` at approximately 390 px and 1440 px:

- no page-level horizontal overflow;
- category and breaking-news horizontal regions remain keyboard accessible;
- hero remains first in mobile reading order;
- internal and external destinations are distinguishable before activation;
- focus rings are visible;
- empty arrays passed to `NewsHero`, `BreakingNews`, `NewsFeed`, and `WeeklyTopic` produce the documented fallback behavior.

- [ ] **Step 6: Review scope before handoff**

Run:

```powershell
git diff -- app/news app/sitemap.ts components/news content/news lib docs/superpowers
```

Expected: only the approved editorial-hub feature, its content, tests, and planning documents appear. Do not create a commit unless the user explicitly requests one.
