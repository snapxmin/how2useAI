import { describe, expect, it } from "vitest";
import {
  getCurriculumProgress,
  getDeveloperCurriculum,
  getNextPendingArticles,
  getPublishedGuideSlugs,
} from "./developer-curriculum";

describe("getDeveloperCurriculum", () => {
  it("loads developer curriculum with 90 articles", () => {
    const curriculum = getDeveloperCurriculum();
    expect(curriculum.role).toBe("developer");
    expect(curriculum.articlesPerDay).toBe(3);
    expect(curriculum.totalArticles).toBe(90);
    expect(curriculum.articles).toHaveLength(90);
  });

  it("has schedule configured for 17:00 CST", () => {
    const curriculum = getDeveloperCurriculum();
    expect(curriculum.schedule.time).toBe("17:00");
    expect(curriculum.schedule.timezone).toBe("Asia/Shanghai");
    expect(curriculum.schedule.cronUtc).toBe("0 9 * * *");
  });
});

describe("getNextPendingArticles", () => {
  it("returns 3 pending articles by default", () => {
    const next = getNextPendingArticles(3);
    expect(next).toHaveLength(3);
    expect(next.every((a) => a.status === "pending")).toBe(true);
  });

  it("skips already published curriculum entries", () => {
    const next = getNextPendingArticles(3);
    const slugs = next.map((a) => a.slug);
    expect(slugs).not.toContain("cursor-setup");
    expect(slugs).not.toContain("ai-code-review-workflow");
    expect(slugs).not.toContain("rag-dev-intro");
  });

  it("returns articles in curriculum order", () => {
    const next = getNextPendingArticles(3);
    expect(next[0].slug).toBe("cursor-tab-completion");
    expect(next[1].slug).toBe("cursor-inline-edit");
    expect(next[2].slug).toBe("cursor-agent-intro");
  });
});

describe("getCurriculumProgress", () => {
  it("tracks published and pending counts", () => {
    const progress = getCurriculumProgress();
    expect(progress.total).toBe(90);
    expect(progress.published).toBe(3);
    expect(progress.pending).toBe(87);
    expect(progress.percentComplete).toBe(3);
  });
});

describe("getPublishedGuideSlugs", () => {
  it("includes existing developer guides", () => {
    const slugs = getPublishedGuideSlugs();
    expect(slugs.has("cursor-beginner-guide")).toBe(true);
    expect(slugs.has("ai-code-review")).toBe(true);
    expect(slugs.has("rag-introduction")).toBe(true);
  });
});
