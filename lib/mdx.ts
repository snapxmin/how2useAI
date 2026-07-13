import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { CopyablePromptBlock } from "@/components/CopyablePromptBlock";
import {
  AnalogyCard,
  ConceptCard,
  Misconception,
  PracticeTip,
} from "@/components/learn/TeachingCards";
import { createHeadingId } from "./mdx-utils";
import { createElement, type ReactNode } from "react";

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    (children as { props?: { children?: ReactNode } }).props
  ) {
    return headingText(
      (children as { props: { children?: ReactNode } }).props.children
    );
  }
  return "";
}

function H2({ children }: { children?: ReactNode }) {
  return createElement("h2", { id: createHeadingId(headingText(children)) }, children);
}

function H3({ children }: { children?: ReactNode }) {
  return createElement("h3", { id: createHeadingId(headingText(children)) }, children);
}

export async function compileMdxContent(
  source: string,
  options?: { lesson?: boolean }
) {
  const { content } = await compileMDX({
    source,
    components: {
      pre: CopyablePromptBlock,
      ...(options?.lesson
        ? {
            h2: H2,
            h3: H3,
            ConceptCard,
            AnalogyCard,
            Misconception,
            PracticeTip,
          }
        : {}),
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
  return content;
}
