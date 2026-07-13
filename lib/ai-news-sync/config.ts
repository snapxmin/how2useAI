export interface RssSource {
  url: string;
  source: string;
  sourceCN: string;
  tier: 1 | 2 | 3;
  lang: "zh" | "en";
}

export const NEWS_WINDOW_DAYS = 14;
export const MAX_NEWS_ITEMS = 10;
export const FEATURED_COUNT = 3;
export const MAX_ITEMS_PER_SOURCE = 3;

/** Official blogs, trusted media, forums and research feeds. */
export const RSS_SOURCES: RssSource[] = [
  {
    url: "https://openai.com/news/rss.xml",
    source: "OpenAI",
    sourceCN: "OpenAI",
    tier: 1,
    lang: "en",
  },
  {
    url: "https://blog.google/innovation-and-ai/technology/ai/rss/",
    source: "Google",
    sourceCN: "Google",
    tier: 1,
    lang: "en",
  },
  {
    url: "https://deepmind.google/blog/rss.xml",
    source: "Google DeepMind",
    sourceCN: "Google DeepMind",
    tier: 1,
    lang: "en",
  },
  {
    url: "https://huggingface.co/blog/feed.xml",
    source: "Hugging Face",
    sourceCN: "Hugging Face",
    tier: 2,
    lang: "en",
  },
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    source: "TechCrunch",
    sourceCN: "TechCrunch",
    tier: 2,
    lang: "en",
  },
  {
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    source: "The Verge",
    sourceCN: "The Verge",
    tier: 2,
    lang: "en",
  },
  {
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    source: "Ars Technica",
    sourceCN: "Ars Technica",
    tier: 2,
    lang: "en",
  },
  {
    url: "https://hnrss.org/newest?q=AI+OR+GPT+OR+Claude+OR+LLM+OR+Gemini+OR+Anthropic",
    source: "Hacker News",
    sourceCN: "Hacker News",
    tier: 2,
    lang: "en",
  },
];

export const TRUSTED_DOMAINS = [
  "openai.com",
  "anthropic.com",
  "google.com",
  "deepmind.google",
  "blog.google",
  "ai.meta.com",
  "meta.com",
  "microsoft.com",
  "huggingface.co",
  "github.com",
  "techcrunch.com",
  "theverge.com",
  "arstechnica.com",
  "reuters.com",
  "bloomberg.com",
  "news.qq.com",
  "36kr.com",
  "ycombinator.com",
  "news.ycombinator.com",
];

export const CATEGORY_RULES: Array<{ category: string; keywords: string[] }> = [
  {
    category: "大模型",
    keywords: [
      "gpt",
      "claude",
      "llm",
      "model",
      "模型",
      "gemini",
      "moe",
      "参数",
      "token",
      "推理",
      "大模型",
    ],
  },
  {
    category: "AI产品",
    keywords: [
      "launch",
      "product",
      "app",
      "chatgpt",
      "产品",
      "发布",
      "推出",
      "api",
      "agent",
      "智能体",
    ],
  },
  {
    category: "开源",
    keywords: [
      "open source",
      "open-source",
      "github",
      "开源",
      "mit",
      "weights",
      "权重",
    ],
  },
  {
    category: "政策安全",
    keywords: [
      "safety",
      "regulation",
      "policy",
      "安全",
      "治理",
      "监管",
      "合规",
    ],
  },
  {
    category: "研究进展",
    keywords: ["research", "paper", "arxiv", "研究", "论文", "benchmark"],
  },
];
