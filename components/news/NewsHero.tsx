import Link from "next/link";
import type { Insight } from "@/lib/types";

export function NewsHero(_props: { insight: Insight | null }) {
  const { insight } = _props;
  if (!insight) return null;

  const { frontmatter } = insight;
  const themeClasses = {
    navy: "from-slate-950 via-blue-950 to-blue-800",
    indigo: "from-indigo-950 via-indigo-900 to-brand-700",
    slate: "from-slate-900 via-slate-800 to-slate-600",
    amber: "from-slate-950 via-amber-950 to-amber-700",
  };

  return (
    <Link
      href={`/news/insights/${insight.slug}`}
      className={`group flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:p-8 ${themeClasses[frontmatter.heroTheme]}`}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-100">
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
          今日焦点
        </span>
        <span>{frontmatter.insightType}</span>
        <span>·</span>
        <span>{frontmatter.readingTime} 分钟阅读</span>
      </div>
      <h2 className="mt-4 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
        {frontmatter.title}
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-200">
        {frontmatter.description}
      </p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm text-slate-300">
          {frontmatter.companies.join(" · ")}
        </span>
        <span className="text-sm font-semibold">
          阅读深度解读 <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
