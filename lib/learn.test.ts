import { describe, expect, it } from "vitest";
import {
  getLessonNavigation,
  groupLessonsByModule,
  validateAndSortLessons,
} from "./learn";
import type { Lesson } from "./types";

function lesson(
  slug: string,
  module: number,
  order: number,
  overrides: Partial<Lesson["frontmatter"]> = {}
): Lesson {
  return {
    slug,
    content: `# ${slug}`,
    frontmatter: {
      title: `课程 ${order}`,
      description: "课程说明",
      module,
      moduleTitle: `模块 ${module}`,
      order,
      duration: 10,
      prerequisites: [],
      objectives: ["理解核心概念"],
      ...overrides,
    },
  };
}

describe("validateAndSortLessons", () => {
  it("按模块和课序排序", () => {
    const result = validateAndSortLessons([
      lesson("third", 2, 3),
      lesson("first", 1, 1),
      lesson("second", 1, 2),
    ]);

    expect(result.map((item) => item.slug)).toEqual(["first", "second", "third"]);
  });

  it("缺少必填字段时指出文件", () => {
    const invalid = lesson("broken", 1, 1, { title: "" });

    expect(() => validateAndSortLessons([invalid])).toThrow(
      "content/learn/broken.mdx: 缺少必填字段 title"
    );
  });

  it("拒绝重复课序", () => {
    expect(() =>
      validateAndSortLessons([lesson("one", 1, 1), lesson("duplicate", 1, 1)])
    ).toThrow("课程顺序重复: module 1, order 1");
  });
});

describe("groupLessonsByModule", () => {
  it("按模块聚合并保留课程顺序", () => {
    const groups = groupLessonsByModule([
      lesson("one", 1, 1),
      lesson("two", 1, 2),
      lesson("three", 2, 3),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].title).toBe("模块 1");
    expect(groups[0].lessons.map((item) => item.slug)).toEqual(["one", "two"]);
  });
});

describe("getLessonNavigation", () => {
  const lessons = [
    lesson("one", 1, 1),
    lesson("two", 1, 2),
    lesson("three", 2, 3),
  ];

  it("首课没有上一课", () => {
    expect(getLessonNavigation(lessons, "one")).toEqual({
      previous: null,
      next: lessons[1],
    });
  });

  it("末课没有下一课", () => {
    expect(getLessonNavigation(lessons, "three")).toEqual({
      previous: lessons[1],
      next: null,
    });
  });
});
