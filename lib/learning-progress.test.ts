import { describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  getContinueSlug,
  parseProgress,
  toggleCompletedLesson,
} from "./learning-progress";

describe("parseProgress", () => {
  it("无法解析时返回空进度", () => {
    expect(parseProgress("not json")).toEqual(createEmptyProgress());
  });

  it("过滤无效完成记录", () => {
    expect(
      parseProgress(
        JSON.stringify({ version: 1, completed: ["one", 2], recent: "two" })
      )
    ).toEqual({ version: 1, completed: ["one"], recent: "two" });
  });
});

describe("toggleCompletedLesson", () => {
  it("可切换课程完成状态并记录最近课程", () => {
    const completed = toggleCompletedLesson(createEmptyProgress(), "one");
    expect(completed).toEqual({
      version: 1,
      completed: ["one"],
      recent: "one",
    });
    expect(toggleCompletedLesson(completed, "one").completed).toEqual([]);
  });
});

describe("getContinueSlug", () => {
  it("优先返回最近课程，否则返回第一节未完成课程", () => {
    expect(
      getContinueSlug(
        { version: 1, completed: [], recent: "two" },
        ["one", "two"]
      )
    ).toBe("two");
    expect(
      getContinueSlug(
        { version: 1, completed: ["one"], recent: null },
        ["one", "two"]
      )
    ).toBe("two");
  });
});
