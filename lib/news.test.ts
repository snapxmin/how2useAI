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
    expect(filterNewsByCategory(items, "大模型").map((item) => item.id)).toEqual([
      "older",
    ]);
    expect(getNewsCategoriesFromItems(items)).toEqual(["全部", "大模型", "AI产品"]);
  });

  it("excludes unsafe URLs from breaking news", () => {
    expect(getBreakingNewsFromItems(items, 5).map((item) => item.id)).toEqual([
      "newer",
      "older",
    ]);
  });
});
