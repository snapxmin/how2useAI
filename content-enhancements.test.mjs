import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("guide pages no longer render share buttons", () => {
  const pageSource = read("./app/guides/[slug]/page.tsx");

  assert(!pageSource.includes("ShareButtons"));
});

test("mdx pre blocks render with copy and theme controls", () => {
  const mdxSource = read("./lib/mdx.ts");

  assert(mdxSource.includes("CopyablePromptBlock"));
  assert(mdxSource.includes("pre: CopyablePromptBlock"));
});
