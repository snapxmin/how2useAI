import { describe, expect, it } from "vitest";
import type { Insight, NewsFeaturedConfig } from "./types";
import {
  getAllInsights,
  getFeaturedConfig,
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
    expect(resolved.hero?.slug).toBe("older");
    expect(resolved.insights.map((item) => item.slug)).toEqual(["newer"]);
  });

  it("loads four launch insights and valid featured references", () => {
    const loaded = getAllInsights();
    const config = getFeaturedConfig();
    const slugs = new Set(loaded.map((item) => item.slug));

    expect(loaded).toHaveLength(4);
    expect(slugs.has(config.heroInsightSlug)).toBe(true);
    expect(config.insightSlugs.every((slug) => slugs.has(slug))).toBe(true);
  });
});
