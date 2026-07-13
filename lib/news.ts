import fs from "fs";
import path from "path";
import type { NewsItem } from "./types";
import {
  filterNewsByCategory,
  getBreakingNewsFromItems,
  getNewsCategoriesFromItems,
  sortNewsByDate,
} from "./news-utils";

export {
  filterNewsByCategory,
  getBreakingNewsFromItems,
  getNewsCategoriesFromItems,
  isSafeExternalUrl,
  sortNewsByDate,
} from "./news-utils";

const newsPath = path.join(process.cwd(), "content/news/news.json");

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
