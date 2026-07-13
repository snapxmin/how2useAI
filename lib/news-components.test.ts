import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BreakingNews } from "@/components/news/BreakingNews";
import { InsightGrid } from "@/components/news/InsightGrid";
import { NewsCategoryNav } from "@/components/news/NewsCategoryNav";
import { NewsFeed } from "@/components/news/NewsFeed";
import { NewsHero } from "@/components/news/NewsHero";
import { WeeklyTopic } from "@/components/news/WeeklyTopic";
import type { Insight, NewsItem } from "./types";

const insight: Insight = {
  slug: "agent-system",
  frontmatter: {
    title: "Agent system",
    description: "How agents organize work",
    date: "2026-07-13",
    category: "大模型",
    insightType: "技术路线",
    companies: ["OpenAI"],
    products: ["GPT"],
    tags: ["Agent"],
    readingTime: 7,
    heroTheme: "navy",
  },
  content: "Body",
};

const news: NewsItem = {
  id: "release",
  title: "Model release",
  summary: "Release summary",
  source: "Official",
  url: "https://example.com/release",
  date: "2026-07-13",
  category: "大模型",
  tags: ["模型"],
};

describe("news portal components", () => {
  it("marks the active category and emits shareable links", () => {
    const html = renderToStaticMarkup(
      createElement(NewsCategoryNav, {
        categories: ["全部", "大模型"],
        activeCategory: "大模型",
      })
    );
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("category=");
  });

  it("distinguishes internal insight and external news destinations", () => {
    const heroHtml = renderToStaticMarkup(
      createElement(NewsHero, { insight })
    );
    const breakingHtml = renderToStaticMarkup(
      createElement(BreakingNews, { items: [news] })
    );
    expect(heroHtml).toContain("/news/insights/agent-system");
    expect(heroHtml).toContain("7 分钟阅读");
    expect(breakingHtml).toContain('target="_blank"');
    expect(breakingHtml).toContain('rel="noopener noreferrer"');
  });

  it("renders explicit empty states for news regions", () => {
    const breakingHtml = renderToStaticMarkup(
      createElement(BreakingNews, { items: [] })
    );
    const feedHtml = renderToStaticMarkup(
      createElement(NewsFeed, { items: [] })
    );
    expect(breakingHtml).toContain("暂无快讯");
    expect(feedHtml).toContain("暂无该分类资讯");
  });

  it("hides an unconfigured weekly topic", () => {
    const html = renderToStaticMarkup(
      createElement(WeeklyTopic, {
        insights: [insight],
        news: [news],
        guides: [],
      })
    );
    expect(html).toBe("");
  });

  it("renders insight cards as internal reading destinations", () => {
    const html = renderToStaticMarkup(
      createElement(InsightGrid, { items: [insight] })
    );
    expect(html).toContain("/news/insights/agent-system");
    expect(html).toContain("技术路线");
    expect(html).toContain("7 分钟");
  });
});
