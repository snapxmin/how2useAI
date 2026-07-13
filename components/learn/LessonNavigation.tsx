import Link from "next/link";
import type { Lesson } from "@/lib/types";

export function LessonNavigation({
  previous,
  next,
  completion,
}: {
  previous: Lesson | null;
  next: Lesson | null;
  completion?: React.ReactNode;
}) {
  return (
    <nav
      aria-label="课间导航"
      className="mt-12 grid gap-3 border-t border-slate-200 pt-8 sm:grid-cols-[1fr_auto_1fr]"
    >
      <div>
        {previous && (
          <Link
            href={`/learn/${previous.slug}`}
            className="block rounded-xl border border-slate-200 p-4 hover:border-brand-300"
          >
            <span className="text-xs text-slate-500">上一课</span>
            <span className="mt-1 block text-sm font-semibold text-slate-800">
              ← {previous.frontmatter.title}
            </span>
          </Link>
        )}
      </div>
      <div className="flex items-center justify-center">{completion}</div>
      <div>
        {next && (
          <Link
            href={`/learn/${next.slug}`}
            className="block rounded-xl border border-slate-200 p-4 text-right hover:border-brand-300"
          >
            <span className="text-xs text-slate-500">下一课</span>
            <span className="mt-1 block text-sm font-semibold text-slate-800">
              {next.frontmatter.title} →
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
