import fs from "fs";
import path from "path";
import type { NewsItem } from "./types";
import { isSafeExternalUrl } from "./urls";

const newsPath = path.join(process.cwd(), "content/news/news.json");

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
  if (!fs.existsSync(newsPath)) {
    return [];
  }
  const data = fs.readFileSync(newsPath, "utf8");
  const items = JSON.parse(data) as NewsItem[];
  return sortNewsByDate(items);
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
