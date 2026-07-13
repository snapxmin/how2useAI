import type { NewsItem } from "../types";
import type { ScoredCandidate } from "./score";
import { hasCJK, simpleHash, slugify, stripHtml } from "./utils";

export function buildChineseTitle(
  title: string,
  source: string,
  sourceCN: string
): string {
  const cleanTitle = stripHtml(title).trim();
  if (hasCJK(cleanTitle)) {
    return cleanTitle;
  }
  return `${sourceCN || source}：${cleanTitle}`;
}

export function buildChineseSummary(
  title: string,
  summary: string,
  source: string,
  sourceCN: string
): string {
  const cleanSummary = stripHtml(summary).replace(/\s+/g, " ").trim();
  const cleanTitle = stripHtml(title).trim();

  if (hasCJK(cleanSummary) && cleanSummary.length >= 20) {
    return cleanSummary.slice(0, 180);
  }

  const excerpt = cleanSummary.slice(0, 140);
  const prefix = sourceCN
    ? `据 ${sourceCN} 官方信息，`
    : `据 ${source} 报道，`;

  if (excerpt) {
    return `${prefix}${excerpt}${cleanSummary.length > 140 ? "…" : ""}`;
  }

  return `${prefix}${cleanTitle}`;
}

export function makeNewsId(title: string, url: string): string {
  const slug = slugify(title);
  const hash = simpleHash(url);
  return slug ? `${slug}-${hash}` : `news-${hash}`;
}

export function toNewsItem(
  candidate: ScoredCandidate,
  featured = false
): NewsItem {
  return {
    id: makeNewsId(candidate.title, candidate.url),
    title: buildChineseTitle(
      candidate.title,
      candidate.source,
      candidate.sourceCN
    ),
    summary: buildChineseSummary(
      candidate.title,
      candidate.summary,
      candidate.source,
      candidate.sourceCN
    ),
    source: candidate.source,
    url: candidate.url,
    date: candidate.date,
    category: candidate.category,
    tags: candidate.tags,
    featured,
  };
}
