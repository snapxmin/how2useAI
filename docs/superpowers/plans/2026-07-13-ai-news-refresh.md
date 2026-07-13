# AI News Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portal's unsupported AI news with 10 source-verified, high-impact events published from June 30 through July 13, 2026.

**Architecture:** Keep the existing static JSON data flow and `NewsItem` interface. Add a focused content-integrity test, replace the JSON records with verified event-specific URLs, and add a visible verification date to the news page.

**Tech Stack:** Next.js 14, TypeScript, JSON, Vitest

---

## File map

- Create `lib/news-content.test.ts`: validates count, date window, IDs, featured selection, field completeness, and event-specific HTTPS URLs.
- Modify `content/news/news.json`: stores the 10 verified news records.
- Modify `app/news/page.tsx`: communicates the last verification date and editorial criteria.
- Keep `lib/news.ts`, `lib/types.ts`, and `components/NewsCard.tsx` unchanged.

### Task 1: Add news content integrity tests

**Files:**
- Create: `lib/news-content.test.ts`
- Read: `content/news/news.json`
- Read: `app/news/page.tsx`

- [ ] **Step 1: Write the failing test**

Create `lib/news-content.test.ts`:

```ts
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import type { NewsItem } from "./types";

const newsPath = path.join(process.cwd(), "content/news/news.json");
const pagePath = path.join(process.cwd(), "app/news/page.tsx");
const items = JSON.parse(fs.readFileSync(newsPath, "utf8")) as NewsItem[];

describe("AI news content", () => {
  it("contains exactly 10 unique, complete records", () => {
    expect(items).toHaveLength(10);
    expect(new Set(items.map((item) => item.id)).size).toBe(10);

    for (const item of items) {
      expect(item.title.trim()).not.toBe("");
      expect(item.summary.trim()).not.toBe("");
      expect(item.source.trim()).not.toBe("");
      expect(item.category.trim()).not.toBe("");
      expect(item.tags.length).toBeGreaterThan(0);
    }
  });

  it("only includes events in the approved 14-day window", () => {
    for (const item of items) {
      expect(item.date >= "2026-06-30").toBe(true);
      expect(item.date <= "2026-07-13").toBe(true);
    }
  });

  it("uses event-specific HTTPS sources and exactly three featured records", () => {
    expect(items.filter((item) => item.featured)).toHaveLength(3);

    for (const item of items) {
      const url = new URL(item.url);
      expect(url.protocol).toBe("https:");
      expect(url.pathname).not.toBe("/");
    }
  });

  it("shows the verification date on the news page", () => {
    const pageSource = fs.readFileSync(pagePath, "utf8");
    expect(pageSource).toContain("截至 2026 年 7 月 13 日");
    expect(pageSource).toContain("联网核验");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npx vitest run lib/news-content.test.ts
```

Expected: FAIL because current records include dates before June 30, generic home-page URLs, and the page lacks the verification statement.

### Task 2: Replace the news dataset

**Files:**
- Modify: `content/news/news.json`
- Test: `lib/news-content.test.ts`

- [ ] **Step 1: Replace all existing records with verified content**

Set `content/news/news.json` to:

```json
[
  {
    "id": "openai-gpt-5-6-general-availability",
    "title": "OpenAI 正式推出 GPT-5.6 系列，分为 Sol、Terra 与 Luna",
    "summary": "OpenAI 将 GPT-5.6 从有限预览推向全球可用，覆盖 ChatGPT、Codex 和 API；旗舰 Sol 新增 ultra 模式，可协调多个智能体并行处理复杂任务。",
    "source": "OpenAI",
    "url": "https://openai.com/index/gpt-5-6/",
    "date": "2026-07-09",
    "category": "大模型",
    "tags": ["OpenAI", "GPT-5.6", "Agent"],
    "featured": true
  },
  {
    "id": "openai-chatgpt-work",
    "title": "OpenAI 发布 ChatGPT Work，可跨应用执行长时间复杂任务",
    "summary": "ChatGPT Work 由 GPT-5.6 驱动，可在应用和文件之间收集信息、拆解任务，并生成表格、幻灯片、文档和网页应用等完整成果。",
    "source": "OpenAI",
    "url": "https://openai.com/index/chatgpt-for-your-most-ambitious-work/",
    "date": "2026-07-09",
    "category": "AI产品",
    "tags": ["ChatGPT", "Agent", "办公效率"],
    "featured": true
  },
  {
    "id": "meta-muse-spark-1-1",
    "title": "Meta 发布 Muse Spark 1.1，并开放 Meta Model API 预览",
    "summary": "Muse Spark 1.1 面向智能体任务强化了工具调用、计算机操作、代码和多模态理解能力，开发者可首次通过公开预览版 Meta Model API 使用该模型。",
    "source": "Meta AI",
    "url": "https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/",
    "date": "2026-07-09",
    "category": "大模型",
    "tags": ["Meta", "Muse Spark", "多模态"],
    "featured": true
  },
  {
    "id": "openai-gpt-live",
    "title": "OpenAI 推出 GPT-Live，新一代语音模型开始接入 ChatGPT",
    "summary": "GPT-Live 主打更自然的全双工语音交互，可在持续对话的同时调用搜索和深度推理；GPT-Live-1 与 mini 版本已开始向 ChatGPT 用户推出。",
    "source": "OpenAI",
    "url": "https://openai.com/index/introducing-gpt-live/",
    "date": "2026-07-08",
    "category": "AI产品",
    "tags": ["OpenAI", "语音", "多模态"],
    "featured": false
  },
  {
    "id": "meta-muse-image-video",
    "title": "Meta 发布 Muse Image，并预览原生音频视频模型 Muse Video",
    "summary": "Muse Image 支持精确编辑、多参考图组合和智能体工具调用，并加入不可见的 Content Seal 来源标记；Muse Video 展示了原生音频视频生成能力。",
    "source": "Meta AI",
    "url": "https://ai.meta.com/blog/introducing-muse-image-muse-video-msl/",
    "date": "2026-07-07",
    "category": "AI产品",
    "tags": ["Meta", "图像生成", "视频生成"],
    "featured": false
  },
  {
    "id": "fli-ai-safety-index-summer-2026",
    "title": "2026 夏季 AI 安全指数发布，九家头部公司最高仅获 C+",
    "summary": "Future of Life Institute 以 37 项指标评估九家 AI 公司，覆盖风险评估、安全框架、治理和信息披露等领域；报告显示行业整体仍未达到高等级安全标准。",
    "source": "Future of Life Institute",
    "url": "https://futureoflife.org/ai-safety-index-summer-2026/",
    "date": "2026-07-07",
    "category": "政策安全",
    "tags": ["AI安全", "治理", "行业报告"],
    "featured": false
  },
  {
    "id": "tencent-hunyuan-hy3",
    "title": "腾讯混元 Hy3 正式上线，强化复杂推理与 Agent 任务能力",
    "summary": "混元 Hy3 采用快慢思考融合的 MoE 架构，总参数 295B、激活参数 21B，支持 256K 上下文，并针对真实办公和生活自动化任务进行了优化。",
    "source": "腾讯新闻",
    "url": "https://news.qq.com/rain/a/20260706A067TS00",
    "date": "2026-07-06",
    "category": "大模型",
    "tags": ["腾讯混元", "Agent", "国内大模型"],
    "featured": false
  },
  {
    "id": "meituan-longcat-2-open-source",
    "title": "美团开源 LongCat-2.0，模型总参数达 1.6 万亿",
    "summary": "LongCat-2.0 是大规模 MoE 语言模型，每个 Token 平均激活约 480 亿参数；官方已开放模型权重，并采用 MIT 许可证。",
    "source": "美团 LongCat",
    "url": "https://github.com/meituan-longcat/longcat-2.0",
    "date": "2026-07-06",
    "category": "开源",
    "tags": ["美团", "LongCat", "MoE"],
    "featured": false
  },
  {
    "id": "anthropic-fable-5-redeployment",
    "title": "Anthropic 恢复 Claude Fable 5 全球访问",
    "summary": "在相关出口限制解除后，Anthropic 恢复 Fable 5 在 Claude 平台、Claude.ai、Claude Code 和 Claude Cowork 的全球访问，并逐步恢复云平台支持。",
    "source": "Anthropic",
    "url": "https://www.anthropic.com/news/redeploying-fable-5",
    "date": "2026-07-01",
    "category": "大模型",
    "tags": ["Anthropic", "Claude", "模型服务"],
    "featured": false
  },
  {
    "id": "google-nano-banana-2-lite-omni-flash",
    "title": "Google 推出 Nano Banana 2 Lite，并向开发者开放 Gemini Omni Flash",
    "summary": "Nano Banana 2 Lite 面向高吞吐图像生成，已接入 AI Studio 和 Gemini API；Gemini Omni Flash 则支持基于文本、图像和视频输入的视频生成与对话式编辑。",
    "source": "Google DeepMind",
    "url": "https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/",
    "date": "2026-06-30",
    "category": "AI产品",
    "tags": ["Google", "Gemini", "生成式媒体"],
    "featured": false
  }
]
```

- [ ] **Step 2: Run the focused test**

Run:

```powershell
npx vitest run lib/news-content.test.ts
```

Expected: only the page verification statement test still fails.

### Task 3: Add transparent verification copy

**Files:**
- Modify: `app/news/page.tsx:20-23`
- Modify: `app/news/page.tsx:40-46`
- Test: `lib/news-content.test.ts`

- [ ] **Step 1: Update the page introduction**

Replace the introductory paragraph with:

```tsx
<p className="mt-3 max-w-2xl text-slate-600">
  精选业界高热度 AI 动态，涵盖大模型、产品发布、开源生态、行业趋势与政策安全。
  当前内容截至 2026 年 7 月 13 日完成联网核验，按时间倒序排列。
</p>
```

- [ ] **Step 2: Update the editorial note**

Replace the note text with:

```tsx
<strong className="text-slate-800">说明：</strong>
资讯优先采用官方公告及权威媒体，并链接具体原文；未经可靠来源确认的传闻不予收录。如需第一时间获取精选动态，可前往
<a href="/subscribe" className="mx-1 font-medium text-brand-600 hover:text-brand-700">
  订阅页面
</a>
加入周报。
```

- [ ] **Step 3: Run the focused test**

Run:

```powershell
npx vitest run lib/news-content.test.ts
```

Expected: PASS, 4 tests passed.

### Task 4: Verify the complete application

**Files:**
- Verify: `lib/news-content.test.ts`
- Verify: `content/news/news.json`
- Verify: `app/news/page.tsx`

- [ ] **Step 1: Run all tests**

Run:

```powershell
npm test
```

Expected: all Vitest suites pass.

- [ ] **Step 2: Run lint**

Run:

```powershell
npm run lint
```

Expected: no ESLint errors.

- [ ] **Step 3: Run the production build**

Run:

```powershell
npm run build
```

Expected: Next.js production build completes successfully, including `/news`.

- [ ] **Step 4: Review the final diff**

Run:

```powershell
git diff -- lib/news-content.test.ts content/news/news.json app/news/page.tsx docs/superpowers
```

Expected: only the approved news refresh, its tests, and planning documents appear. Do not commit unless the user explicitly requests it.
