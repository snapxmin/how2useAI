import fs from "fs";
import path from "path";
import type { Tool } from "./types";

const toolsPath = path.join(process.cwd(), "content/tools/tools.json");

/** 国内工具优先排序：Kimi、豆包、DeepSeek 等排在前面 */
const DOMESTIC_TOOL_ORDER = ["kimi", "doubao", "deepseek", "coze", "dify"];

function getToolSortPriority(tool: Tool): number {
  const domesticIndex = DOMESTIC_TOOL_ORDER.indexOf(tool.id);
  if (domesticIndex >= 0) return domesticIndex;

  if (tool.category === "国内大模型") return DOMESTIC_TOOL_ORDER.length;

  return 100;
}

export function sortToolsDomesticFirst(tools: Tool[]): Tool[] {
  return [...tools].sort(
    (a, b) => getToolSortPriority(a) - getToolSortPriority(b)
  );
}

export function getAllTools(): Tool[] {
  if (!fs.existsSync(toolsPath)) {
    return [];
  }
  const data = fs.readFileSync(toolsPath, "utf8");
  return sortToolsDomesticFirst(JSON.parse(data) as Tool[]);
}

export function getFeaturedTools(limit = 6): Tool[] {
  const tools = getAllTools();
  const featured = tools.filter((t) => t.featured);
  return sortToolsDomesticFirst(featured.length > 0 ? featured : tools).slice(
    0,
    limit
  );
}

export function getToolsByRole(role: string): Tool[] {
  return sortToolsDomesticFirst(
    getAllTools().filter((tool) => tool.roles.includes(role))
  );
}
