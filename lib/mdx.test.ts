import { describe, expect, it } from "vitest";
import { createHeadingId, extractLessonToc } from "./mdx-utils";

describe("createHeadingId", () => {
  it("为中英文标题生成稳定锚点", () => {
    expect(createHeadingId("Token 是什么？")).toBe("token-是什么");
    expect(createHeadingId("Agent Loop")).toBe("agent-loop");
  });
});

describe("extractLessonToc", () => {
  it("只提取二三级标题并保留层级", () => {
    const toc = extractLessonToc(`
# 页面标题
## 日常问题
### 一个例子
#### 不进入目录
## 三句总结
`);

    expect(toc).toEqual([
      { id: "日常问题", title: "日常问题", level: 2 },
      { id: "一个例子", title: "一个例子", level: 3 },
      { id: "三句总结", title: "三句总结", level: 2 },
    ]);
  });
});
