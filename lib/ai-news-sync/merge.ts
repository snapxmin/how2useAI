import type { NewsItem } from "../types";
import { FEATURED_COUNT, MAX_ITEMS_PER_SOURCE, MAX_NEWS_ITEMS } from "./config";
import type { ScoredCandidate } from "./score";
import { toNewsItem } from "./transform";
import { isWithinWindow } from "./utils";

export function mergeNewsItems(
  existing: NewsItem[],
  ranked: ScoredCandidate[],
  windowDays: number,
  now = new Date()
): NewsItem[] {
  const freshExisting = existing.filter((item) =>
    isWithinWindow(item.date, windowDays, now)
  );

  const selected: NewsItem[] = [];
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const sourceCounts = new Map<string, number>();

  for (const candidate of ranked) {
    const sourceCount = sourceCounts.get(candidate.source) ?? 0;
    if (sourceCount >= MAX_ITEMS_PER_SOURCE) {
      continue;
    }

    const item = toNewsItem(candidate, false);
    if (seenIds.has(item.id) || seenUrls.has(item.url)) {
      continue;
    }
    selected.push(item);
    seenIds.add(item.id);
    seenUrls.add(item.url);
    sourceCounts.set(candidate.source, sourceCount + 1);
    if (selected.length >= MAX_NEWS_ITEMS) {
      break;
    }
  }

  if (selected.length < MAX_NEWS_ITEMS) {
    for (const item of freshExisting) {
      if (seenIds.has(item.id) || seenUrls.has(item.url)) {
        continue;
      }
      selected.push(item);
      seenIds.add(item.id);
      seenUrls.add(item.url);
      if (selected.length >= MAX_NEWS_ITEMS) {
        break;
      }
    }
  }

  const featuredIds = new Set(
    [...selected]
      .sort((a, b) => {
        const scoreA = ranked.find((item) => item.url === a.url)?.score ?? 0;
        const scoreB = ranked.find((item) => item.url === b.url)?.score ?? 0;
        return scoreB - scoreA;
      })
      .slice(0, FEATURED_COUNT)
      .map((item) => item.id)
  );

  return [...selected]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item) => ({
      ...item,
      featured: featuredIds.has(item.id),
    }));
}

export function getNewsWindowStart(windowDays: number, now = new Date()): string {
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - windowDays);
  return start.toISOString().slice(0, 10);
}

export function getNewsLastUpdated(items: NewsItem[]): string | null {
  if (items.length === 0) {
    return null;
  }
  return items.reduce((latest, item) =>
    item.date > latest ? item.date : latest
  , items[0].date);
}

export function formatNewsUpdatedLabel(date: string): string {
  const [year, month, day] = date.split("-");
  return `截至 ${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}
