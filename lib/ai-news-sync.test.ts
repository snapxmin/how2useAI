import { describe, expect, it } from "vitest";
import {
  FEATURED_COUNT,
  MAX_NEWS_ITEMS,
  NEWS_WINDOW_DAYS,
  buildChineseSummary,
  buildChineseTitle,
  dedupeCandidates,
  formatNewsUpdatedLabel,
  getNewsLastUpdated,
  getNewsWindowStart,
  isEventSpecificUrl,
  isTrustedDomain,
  isWithinWindow,
  mergeNewsItems,
  rankCandidates,
  validateNewsCandidate,
} from "./ai-news-sync";
import type { NewsItem } from "./types";

describe("ai-news-sync", () => {
  const now = new Date("2026-07-13T10:30:00.000Z");

  it("validates trusted event-specific HTTPS links in the window", () => {
    const item = {
      title: "OpenAI launches GPT test",
      summary: "OpenAI announced a new model for developers.",
      source: "OpenAI",
      sourceCN: "OpenAI",
      url: "https://openai.com/index/gpt-test/",
      date: "2026-07-12",
    };

    expect(validateNewsCandidate(item, NEWS_WINDOW_DAYS, now)).toBeNull();
    expect(isTrustedDomain(item.url)).toBe(true);
    expect(isEventSpecificUrl(item.url)).toBe(true);
  });

  it("rejects homepage links and stale items", () => {
    expect(
      validateNewsCandidate(
        {
          title: "Homepage",
          summary: "summary",
          source: "OpenAI",
          sourceCN: "OpenAI",
          url: "https://openai.com/",
          date: "2026-07-12",
        },
        NEWS_WINDOW_DAYS,
        now
      )
    ).toBe("homepage or invalid url");

    expect(
      validateNewsCandidate(
        {
          title: "Old",
          summary: "summary",
          source: "OpenAI",
          sourceCN: "OpenAI",
          url: "https://openai.com/index/old/",
          date: "2026-06-01",
        },
        NEWS_WINDOW_DAYS,
        now
      )
    ).toBe("outside time window");
  });

  it("builds readable Chinese summaries for English official posts", () => {
    expect(
      buildChineseTitle("Introducing GPT-Live", "OpenAI", "OpenAI")
    ).toBe("OpenAI：Introducing GPT-Live");
    expect(
      buildChineseSummary(
        "Introducing GPT-Live",
        "A new voice model for ChatGPT.",
        "OpenAI",
        "OpenAI"
      )
    ).toContain("据 OpenAI 官方信息");
  });

  it("ranks fresher high-tier items higher", () => {
    const ranked = rankCandidates(
      [
        {
          title: "Older model",
          summary: "A model release",
          source: "OpenAI",
          sourceCN: "OpenAI",
          url: "https://openai.com/index/older/",
          date: "2026-07-01",
          tier: 1,
        },
        {
          title: "Newer GPT launch",
          summary: "GPT launch for developers",
          source: "OpenAI",
          sourceCN: "OpenAI",
          url: "https://openai.com/index/newer/",
          date: "2026-07-12",
          tier: 1,
        },
      ],
      new Map([["https://openai.com/index/newer/", 120]]),
      now
    );

    expect(ranked[0].url).toContain("newer");
  });

  it("merges ranked items and marks top three as featured", () => {
    const merged = mergeNewsItems(
      [],
      rankCandidates(
        [
          {
            title: "A",
            summary: "summary A",
            source: "OpenAI",
            sourceCN: "OpenAI",
            url: "https://openai.com/index/a/",
            date: "2026-07-12",
            tier: 1,
          },
          {
            title: "B",
            summary: "summary B",
            source: "Google",
            sourceCN: "Google",
            url: "https://blog.google/technology/ai/b/",
            date: "2026-07-11",
            tier: 1,
          },
          {
            title: "C",
            summary: "summary C",
            source: "Hugging Face",
            sourceCN: "Hugging Face",
            url: "https://huggingface.co/blog/c",
            date: "2026-07-10",
            tier: 2,
          },
          {
            title: "D",
            summary: "summary D",
            source: "TechCrunch",
            sourceCN: "TechCrunch",
            url: "https://techcrunch.com/2026/07/09/d/",
            date: "2026-07-09",
            tier: 2,
          },
        ],
        new Map(),
        now
      ),
      NEWS_WINDOW_DAYS,
      now
    );

    expect(merged).toHaveLength(4);
    expect(merged.filter((item) => item.featured)).toHaveLength(FEATURED_COUNT);
  });

  it("deduplicates by url and title", () => {
    const deduped = dedupeCandidates([
      {
        title: "Same",
        url: "https://openai.com/index/same/",
      },
      {
        title: "Same",
        url: "https://openai.com/index/same/",
      },
      {
        title: "Different",
        url: "https://openai.com/index/other/",
      },
    ]);

    expect(deduped).toHaveLength(2);
  });

  it("exposes dynamic window helpers", () => {
    expect(getNewsWindowStart(NEWS_WINDOW_DAYS, now)).toBe("2026-06-29");
    expect(isWithinWindow("2026-06-29", NEWS_WINDOW_DAYS, now)).toBe(true);
    expect(isWithinWindow("2026-06-28", NEWS_WINDOW_DAYS, now)).toBe(false);

    const items: NewsItem[] = [
      {
        id: "a",
        title: "A",
        summary: "A",
        source: "OpenAI",
        url: "https://openai.com/index/a/",
        date: "2026-07-10",
        category: "大模型",
        tags: ["OpenAI"],
      },
      {
        id: "b",
        title: "B",
        summary: "B",
        source: "Google",
        url: "https://blog.google/technology/ai/b/",
        date: "2026-07-12",
        category: "AI产品",
        tags: ["Google"],
      },
    ];

    expect(getNewsLastUpdated(items)).toBe("2026-07-12");
    expect(formatNewsUpdatedLabel("2026-07-12")).toBe("截至 2026 年 7 月 12 日");
    expect(MAX_NEWS_ITEMS).toBe(10);
  });
});
