import { describe, expect, it } from "vitest";
import type { ColumnArticle } from "./types";
import {
  getAllColumnArticleParams,
  getAllColumnConfigs,
  getColumnArticles,
  getColumnConfig,
  getFeaturedColumnArticle,
  groupArticlesByTopic,
  parseColumnArticle,
  sortColumnArticlesByDate,
} from "./columns";

const articles: ColumnArticle[] = [
  {
    columnId: "ai4se-devops",
    slug: "older",
    frontmatter: {
      title: "Older",
      description: "Older article",
      date: "2026-07-01",
      topic: "AI4SE 概览",
      tags: ["AI4SE"],
      readingTime: 6,
      featured: true,
    },
    content: "Content",
  },
  {
    columnId: "ai4se-devops",
    slug: "newer",
    frontmatter: {
      title: "Newer",
      description: "Newer article",
      date: "2026-07-03",
      topic: "AIOps 智能运维",
      tags: ["AIOps"],
      readingTime: 5,
    },
    content: "Content",
  },
];

describe("column loader", () => {
  it("parses valid frontmatter and rejects missing required fields", () => {
    const source = `---
title: Valid
description: Valid description
date: 2026-07-03
topic: AI4SE 概览
tags: [AI4SE]
readingTime: 6
---
Body`;
    expect(parseColumnArticle("ai4se-devops", "valid", source).frontmatter.title).toBe(
      "Valid"
    );
    expect(() =>
      parseColumnArticle("ai4se-devops", "invalid", "---\ntitle: Invalid\n---\nBody")
    ).toThrow("invalid");
  });

  it("sorts newest first", () => {
    expect(sortColumnArticlesByDate(articles).map((item) => item.slug)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("groups articles by topic in defined order", () => {
    const grouped = groupArticlesByTopic(articles);
    expect(grouped.map((g) => g.topic)).toEqual(["AI4SE 概览", "AIOps 智能运维"]);
    expect(grouped[0]?.articles[0]?.slug).toBe("older");
  });

  it("falls back featured article when configured slug is missing", () => {
    const featured = getFeaturedColumnArticle("ai4se-devops");
    expect(featured?.slug).toBe("ai4se-devops-landscape");
  });

  it("loads column config and four launch articles", () => {
    const config = getColumnConfig("ai4se-devops");
    const loaded = getColumnArticles("ai4se-devops");
    const params = getAllColumnArticleParams();
    const columns = getAllColumnConfigs();

    expect(config?.name).toContain("AI4SE");
    expect(loaded).toHaveLength(4);
    expect(params).toHaveLength(4);
    expect(columns).toHaveLength(1);
    expect(config?.featuredArticleSlug).toBe("ai4se-devops-landscape");
  });
});
