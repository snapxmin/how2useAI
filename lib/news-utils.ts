import type { NewsItem } from "./types";

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
