import Link from "next/link";
import type { ColumnArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ColumnArticleCard({
  article,
  columnId,
}: {
  article: ColumnArticle;
  columnId: string;
}) {
  const { slug, frontmatter } = article;

  return (
    <Link
      href={`/columns/${columnId}/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 bg-violet-50 px-5 py-3">
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-violet-700">
          {frontmatter.topic}
        </span>
        {frontmatter.episode !== undefined && (
          <span className="text-xs font-medium text-violet-600">
            第 {frontmatter.episode} 期
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
          <span>· {frontmatter.readingTime} 分钟</span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900 group-hover:text-violet-700">
          {frontmatter.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {frontmatter.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {frontmatter.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
