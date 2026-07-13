import Link from "next/link";
import type { Lesson } from "@/lib/types";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { frontmatter } = lesson;
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
        {frontmatter.order}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{frontmatter.duration} 分钟</span>
          <span>·</span>
          <span>零基础</span>
        </span>
        <span className="mt-1 block font-semibold text-slate-900 group-hover:text-brand-700">
          {frontmatter.title}
        </span>
        <span className="mt-2 block text-sm leading-6 text-slate-600">
          {frontmatter.description}
        </span>
      </span>
    </Link>
  );
}
