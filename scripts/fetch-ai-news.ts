import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import {
  RSS_SOURCES,
  NEWS_WINDOW_DAYS,
  dedupeCandidates,
  formatDate,
  mergeNewsItems,
  normalizeUrl,
  parseFeedDate,
  rankCandidates,
  stripHtml,
  validateNewsCandidate,
} from "../lib/ai-news-sync";
import type { NewsItem } from "../lib/types";
import type { RawNewsCandidate } from "../lib/ai-news-sync";

const parser = new Parser({
  timeout: 20000,
  headers: {
    "User-Agent": "how2useAI-news-bot/1.0 (+https://github.com/snapxmin/how2useAI)",
  },
});

const newsPath = path.join(process.cwd(), "content/news/news.json");

async function fetchHnHeatMap(): Promise<Map<string, number>> {
  const since = Math.floor(Date.now() / 1000) - NEWS_WINDOW_DAYS * 24 * 60 * 60;
  const url = `https://hn.algolia.com/api/v1/search?tags=story&query=AI&numericFilters=created_at_i>${since}&hitsPerPage=100`;
  const heatMap = new Map<string, number>();

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "how2useAI-news-bot/1.0",
      },
    });
    if (!response.ok) {
      console.warn(`HN heat lookup failed: ${response.status}`);
      return heatMap;
    }

    const payload = (await response.json()) as {
      hits: Array<{ url?: string; points?: number }>;
    };

    for (const hit of payload.hits) {
      if (!hit.url) {
        continue;
      }
      const normalized = normalizeUrl(hit.url);
      const points = hit.points ?? 0;
      heatMap.set(normalized, Math.max(heatMap.get(normalized) ?? 0, points));
    }
  } catch (error) {
    console.warn("HN heat lookup error:", error);
  }

  return heatMap;
}

async function fetchRssCandidates(now = new Date()): Promise<
  Array<RawNewsCandidate & { tier: number }>
> {
  const candidates: Array<RawNewsCandidate & { tier: number }> = [];

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items) {
        const link = item.link || item.guid;
        const published = parseFeedDate(item.isoDate || item.pubDate);
        if (!link || !published) {
          continue;
        }

        const title = stripHtml(item.title ?? "").trim();
        const summary = stripHtml(
          item.contentSnippet || item.content || item.summary || title
        ).trim();

        const candidate: RawNewsCandidate & { tier: number } = {
          title,
          summary: summary || title,
          source: source.source,
          sourceCN: source.sourceCN,
          url: link,
          date: formatDate(published),
          tier: source.tier,
        };

        const error = validateNewsCandidate(candidate, NEWS_WINDOW_DAYS, now);
        if (!error) {
          candidates.push(candidate);
        }
      }
      console.log(`Fetched ${source.source}: ${feed.items.length} items`);
    } catch (error) {
      console.warn(`RSS fetch failed for ${source.source}:`, error);
    }
  }

  return dedupeCandidates(candidates);
}

async function main() {
  const now = new Date();
  console.log(`Starting AI news sync at ${now.toISOString()}`);

  const [candidates, heatMap] = await Promise.all([
    fetchRssCandidates(now),
    fetchHnHeatMap(),
  ]);

  console.log(`Validated candidates: ${candidates.length}`);

  const ranked = rankCandidates(candidates, heatMap, now);
  const existing: NewsItem[] = fs.existsSync(newsPath)
    ? (JSON.parse(fs.readFileSync(newsPath, "utf8")) as NewsItem[])
    : [];

  const merged = mergeNewsItems(existing, ranked, NEWS_WINDOW_DAYS, now);

  if (merged.length === 0) {
    console.error("No valid news items found. Keeping existing content.");
    process.exit(1);
  }

  fs.writeFileSync(newsPath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`Updated ${newsPath} with ${merged.length} items`);
  console.log(
    "Top items:",
    merged.slice(0, 3).map((item) => `${item.date} ${item.title}`)
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
