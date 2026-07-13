import type { LessonTocItem } from "./types";

export function createHeadingId(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u3400-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractLessonToc(source: string): LessonTocItem[] {
  const items: LessonTocItem[] = [];

  for (const line of source.split(/\r?\n/)) {
    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const title = match[2].replace(/[*_`]/g, "");
    items.push({
      id: createHeadingId(title),
      title,
      level: match[1].length as 2 | 3,
    });
  }

  return items;
}
