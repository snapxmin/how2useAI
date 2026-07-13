#!/usr/bin/env node
/**
 * 通过 Cursor Cloud Agents API 触发每日开发者指南生成
 * 需要环境变量 CURSOR_API_KEY
 *
 * Usage:
 *   CURSOR_API_KEY=xxx node scripts/trigger-daily-developer-guides.mjs
 */

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = "https://api.cursor.com/v1";
const REPO_URL = "https://github.com/snapxmin/how2useAI";

async function main() {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error("CURSOR_API_KEY is required");
    process.exit(1);
  }

  const prompt = execSync("node scripts/get-next-developer-guides.mjs --prompt", {
    cwd: path.join(__dirname, ".."),
    encoding: "utf8",
  });

  const body = {
    prompt: { text: prompt },
    name: "每日开发者实战指南",
    repos: [{ url: REPO_URL, startingRef: "main" }],
    autoCreatePR: true,
    mode: "agent",
  };

  const response = await fetch(`${API_BASE}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`API error ${response.status}: ${error}`);
    process.exit(1);
  }

  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
