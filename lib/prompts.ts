import fs from "fs";
import path from "path";
import type { Prompt } from "./types";

const promptsPath = path.join(process.cwd(), "content/prompts/prompts.json");

export function getAllPrompts(): Prompt[] {
  if (!fs.existsSync(promptsPath)) {
    return [];
  }
  const data = fs.readFileSync(promptsPath, "utf8");
  return JSON.parse(data) as Prompt[];
}

export function getPromptsByRole(role: string): Prompt[] {
  return getAllPrompts().filter((p) => p.role === role || p.role === "general");
}

export function getPromptById(id: string): Prompt | null {
  return getAllPrompts().find((p) => p.id === id) ?? null;
}
