import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  FEATURED_COUNT,
  MAX_NEWS_ITEMS,
  NEWS_WINDOW_DAYS,
  getNewsLastUpdated,
  getNewsWindowStart,
  isWithinWindow,
} from "./ai-news-sync";
import type { NewsItem } from "./types";

const newsPath = path.join(process.cwd(), "content/news/news.json");
const pagePath = path.join(process.cwd(), "app/news/page.tsx");
const items = JSON.parse(fs.readFileSync(newsPath, "utf8")) as NewsItem[];

describe("AI news content", () => {
  it("contains unique, complete records up to the configured limit", () => {
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(MAX_NEWS_ITEMS);
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);

    for (const item of items) {
      expect(item.title.trim()).not.toBe("");
      expect(item.summary.trim()).not.toBe("");
      expect(item.source.trim()).not.toBe("");
      expect(item.category.trim()).not.toBe("");
      expect(item.tags.length).toBeGreaterThan(0);
    }
  });

  it("only includes events in the rolling 14-day window", () => {
    const lastUpdated = getNewsLastUpdated(items);
    expect(lastUpdated).not.toBeNull();

    const windowStart = getNewsWindowStart(NEWS_WINDOW_DAYS, new Date(`${lastUpdated}T12:00:00.000Z`));
    for (const item of items) {
      expect(item.date >= windowStart).toBe(true);
      expect(item.date <= lastUpdated!).toBe(true);
      expect(isWithinWindow(item.date, NEWS_WINDOW_DAYS, new Date(`${lastUpdated}T12:00:00.000Z`))).toBe(true);
    }
  });

  it("uses event-specific HTTPS sources and exactly three featured records", () => {
    expect(items.filter((item) => item.featured)).toHaveLength(FEATURED_COUNT);

    for (const item of items) {
      const url = new URL(item.url);
      expect(url.protocol).toBe("https:");
      expect(url.pathname).not.toBe("/");
    }
  });

  it("shows the verification label on the news page", () => {
    const pageSource = fs.readFileSync(pagePath, "utf8");
    const metadataSource = fs.readFileSync(
      path.join(process.cwd(), "lib/news-metadata.ts"),
      "utf8"
    );
    expect(pageSource).toContain("getNewsVerificationLabel");
    expect(metadataSource).toContain("联网核验");
    expect(pageSource).toContain("18:30");
    expect(pageSource).toContain("NewsCategoryFilter");
    expect(pageSource).toContain("NewsHero");
    expect(pageSource).toContain("BreakingNews");
  });
});
