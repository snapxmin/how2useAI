import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const routePath = path.join(
  process.cwd(),
  "app/news/insights/[slug]/page.tsx"
);

describe("insight article route", () => {
  it("statically renders MDX insights with article metadata", () => {
    expect(fs.existsSync(routePath)).toBe(true);
    const source = fs.readFileSync(routePath, "utf8");
    expect(source).toContain("generateStaticParams");
    expect(source).toContain("compileMdxContent");
    expect(source).toContain('"@type": "Article"');
    expect(source).toContain("SubscribeForm");
  });
});
