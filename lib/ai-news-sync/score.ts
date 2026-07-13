import { CATEGORY_RULES } from "./config";
import type { RawNewsCandidate } from "./validate";
import { hasCJK } from "./utils";

export interface ScoredCandidate extends RawNewsCandidate {
  category: string;
  tags: string[];
  score: number;
  tier: number;
  hnPoints: number;
  sourceCN: string;
}

const TIER_WEIGHT = { 1: 40, 2: 25, 3: 10 } as const;

const HOT_KEYWORDS = [
  "gpt",
  "claude",
  "gemini",
  "openai",
  "anthropic",
  "agent",
  "智能体",
  "开源",
  "发布",
  "launch",
  "model",
  "模型",
];

export function detectCategory(title: string, summary: string): string {
  const haystack = `${title} ${summary}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))) {
      return rule.category;
    }
  }
  return "行业动态";
}

export function extractTags(title: string, summary: string, source: string): string[] {
  const tags = new Set<string>();
  const haystack = `${title} ${summary}`.toLowerCase();

  const tagCandidates = [
    "OpenAI",
    "Anthropic",
    "Google",
    "Meta",
    "Microsoft",
    "Hugging Face",
    "GPT",
    "Claude",
    "Gemini",
    "Agent",
    "开源",
    "多模态",
    "推理",
    "模型",
  ];

  for (const tag of tagCandidates) {
    if (haystack.includes(tag.toLowerCase())) {
      tags.add(tag);
    }
  }

  if (tags.size === 0) {
    tags.add(source);
  }

  return Array.from(tags).slice(0, 4);
}

export function scoreCandidate(
  item: RawNewsCandidate & { tier: number },
  hnPoints = 0,
  now = new Date()
): number {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  const tierScore = TIER_WEIGHT[item.tier as 1 | 2 | 3] ?? 10;
  const heatScore = Math.min(hnPoints, 500) / 10;
  const keywordScore = HOT_KEYWORDS.filter((keyword) =>
    text.includes(keyword.toLowerCase())
  ).length * 3;
  const chineseBonus = hasCJK(item.title) || hasCJK(item.summary) ? 8 : 0;

  const ageDays = Math.max(
    0,
    (now.getTime() - new Date(`${item.date}T00:00:00.000Z`).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const recencyScore = Math.max(0, 20 - ageDays * 1.5);

  return tierScore + heatScore + keywordScore + chineseBonus + recencyScore;
}

export function rankCandidates(
  items: Array<RawNewsCandidate & { tier: number }>,
  heatMap: Map<string, number>,
  now = new Date()
): ScoredCandidate[] {
  return items
    .map((item) => {
      const hnPoints = heatMap.get(item.url) ?? 0;
      return {
        ...item,
        category: detectCategory(item.title, item.summary),
        tags: extractTags(item.title, item.summary, item.source),
        hnPoints,
        score: scoreCandidate(item, hnPoints, now),
      };
    })
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date));
}
