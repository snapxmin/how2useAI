#!/usr/bin/env node
/**
 * 获取今日待生成的开发者实战指南（默认 3 篇）
 * 供 Cursor Automation 或 GitHub Actions 调用
 *
 * Usage:
 *   node scripts/get-next-developer-guides.mjs
 *   node scripts/get-next-developer-guides.mjs --count 3 --json
 *   node scripts/get-next-developer-guides.mjs --prompt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const curriculumPath = path.join(root, "content/guides/developer-curriculum.json");
const guidesDir = path.join(root, "content/guides");

function parseArgs(argv) {
  const args = { count: 3, json: false, prompt: false, day: null, phase: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--count" && argv[i + 1]) {
      args.count = parseInt(argv[++i], 10);
    } else if (argv[i] === "--json") {
      args.json = true;
    } else if (argv[i] === "--prompt") {
      args.prompt = true;
    } else if (argv[i] === "--day" && argv[i + 1]) {
      args.day = parseInt(argv[++i], 10);
    } else if (argv[i] === "--phase" && argv[i + 1]) {
      args.phase = argv[++i];
    }
  }
  return args;
}

function getPublishedSlugs() {
  if (!fs.existsSync(guidesDir)) return new Set();
  return new Set(
    fs
      .readdirSync(guidesDir)
      .filter((n) => n.endsWith(".mdx"))
      .map((n) => n.replace(/\.mdx$/, ""))
  );
}

function getNextArticles(count, filters = {}) {
  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
  const publishedSlugs = getPublishedSlugs();

  let pending = curriculum.articles.filter((a) => {
    if (a.status === "published") return false;
    if (publishedSlugs.has(a.slug)) return false;
    if (a.publishedSlug && publishedSlugs.has(a.publishedSlug)) return false;
    return true;
  });

  if (filters.day) pending = pending.filter((a) => a.day === filters.day);
  if (filters.phase) pending = pending.filter((a) => a.phase === filters.phase);

  return pending.slice(0, count);
}

function buildAutomationPrompt(articles) {
  const today = new Date().toISOString().slice(0, 10);
  const articleList = articles
    .map(
      (a, i) =>
        `${i + 1}. **${a.title}** (slug: \`${a.slug}\`)
   - 阶段: 第 ${a.day} 天 / ${a.phase} / ${a.level}
   - 场景: ${a.scene}
   - 描述: ${a.description}
   - 标签: ${a.tags.join(", ")}
   - 工具: ${a.tools.length > 0 ? a.tools.join(", ") : "通用"}`
    )
    .join("\n\n");

  return `你是「如何用好AI」门户的开发者内容编辑。请为开发编程栏目撰写 ${articles.length} 篇实战指南 MDX 文章。

## 今日任务（${today}）

${articleList}

## 写作要求

1. 在 \`content/guides/\` 下为每篇文章创建 \`{slug}.mdx\` 文件
2. Frontmatter 格式：
\`\`\`yaml
---
title: "文章标题"
description: "一句话描述"
role: developer
scene: ${articles[0]?.scene ?? "coding"}
date: "${today}"
tags: ["标签1", "标签2"]
featured: false
---
\`\`\`
3. 每篇 800-1500 字，结构：概述 → 实操步骤 → 最佳实践 → 常见问题 → 延伸阅读
4. 覆盖 Cursor、Codex、Claude Code 等工具的真实操作场景与最佳实践
5. 使用中文，代码示例清晰可运行
6. 参考已有文章风格：\`content/guides/cursor-beginner-guide.mdx\`

## 完成后

1. 更新 \`content/guides/developer-curriculum.json\`，将对应文章 status 改为 published
2. 运行 \`npm test\` 确保通过
3. 提交并创建 PR，标题：「每日开发者指南：${articles.map((a) => a.title).join("、")}」`;
}

const args = parseArgs(process.argv);
const articles = getNextArticles(args.count, {
  day: args.day,
  phase: args.phase,
});

if (articles.length === 0) {
  console.error("No pending articles in curriculum.");
  process.exit(1);
}

if (args.prompt) {
  console.log(buildAutomationPrompt(articles));
} else if (args.json) {
  console.log(JSON.stringify({ articles, date: new Date().toISOString() }, null, 2));
} else {
  console.log(`Next ${articles.length} developer guides:\n`);
  for (const a of articles) {
    console.log(`- [Day ${a.day}/${a.phase}] ${a.slug}: ${a.title}`);
  }
}
