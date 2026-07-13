import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

describe("sitemap", () => {
  it("includes internal news insight pages", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "app/sitemap.ts"),
      "utf8"
    );
    expect(source).toContain("getAllInsights");
    expect(source).toContain("/news/insights/");
    expect(source).toContain("insightUrls");
  });
});
