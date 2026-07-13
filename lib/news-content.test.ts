import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import type { NewsItem } from "./types";

const newsPath = path.join(process.cwd(), "content/news/news.json");
const pagePath = path.join(process.cwd(), "app/news/page.tsx");
const items = JSON.parse(fs.readFileSync(newsPath, "utf8")) as NewsItem[];

describe("AI news content", () => {
  it("contains exactly 10 unique, complete records", () => {
    expect(items).toHaveLength(10);
    expect(new Set(items.map((item) => item.id)).size).toBe(10);

    for (const item of items) {
      expect(item.title.trim()).not.toBe("");
      expect(item.summary.trim()).not.toBe("");
      expect(item.source.trim()).not.toBe("");
      expect(item.category.trim()).not.toBe("");
      expect(item.tags.length).toBeGreaterThan(0);
    }
  });

  it("only includes events in the approved 14-day window", () => {
    for (const item of items) {
      expect(item.date >= "2026-06-30").toBe(true);
      expect(item.date <= "2026-07-13").toBe(true);
    }
  });

  it("uses event-specific HTTPS sources and exactly three featured records", () => {
    expect(items.filter((item) => item.featured)).toHaveLength(3);

    for (const item of items) {
      const url = new URL(item.url);
      expect(url.protocol).toBe("https:");
      expect(url.pathname).not.toBe("/");
    }
  });

  it("shows the verification date on the news page", () => {
    const pageSource = fs.readFileSync(pagePath, "utf8");
    expect(pageSource).toContain("截至 2026 年 7 月 13 日");
    expect(pageSource).toContain("联网核验");
    expect(pageSource).toContain("NewsCategoryNav");
    expect(pageSource).toContain("NewsHero");
    expect(pageSource).toContain("BreakingNews");
  });
});
