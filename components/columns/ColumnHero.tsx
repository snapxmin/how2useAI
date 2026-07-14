import Link from "next/link";
import type { ColumnArticle, ColumnConfig } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const themeClasses: Record<ColumnConfig["heroTheme"], string> = {
  violet: "from-violet-950 via-purple-950 to-slate-950",
  indigo: "from-indigo-950 via-blue-950 to-slate-950",
  emerald: "from-emerald-950 via-teal-950 to-slate-950",
  slate: "from-slate-900 via-slate-800 to-slate-950",
};

export function ColumnHero({
  config,
  featured,
}: {
  config: ColumnConfig;
  featured: ColumnArticle | null;
}) {
  if (!featured) return null;

  return (
    <section
      className={`overflow-hidden rounded-2xl bg-gradient-to-br ${themeClasses[config.heroTheme]} p-6 text-white sm:p-8`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
        专栏精选
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
        {featured.frontmatter.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100 sm:text-base">
        {featured.frontmatter.description}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-violet-200">
        <span className="rounded-full bg-white/10 px-3 py-1">
          {featured.frontmatter.topic}
        </span>
        <time dateTime={featured.frontmatter.date}>
          {formatDate(featured.frontmatter.date)}
        </time>
        <span>· {featured.frontmatter.readingTime} 分钟阅读</span>
      </div>
      <Link
        href={`/columns/${config.id}/${featured.slug}`}
        className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-violet-900 transition-colors hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-violet-900"
      >
        阅读全文 →
      </Link>
    </section>
  );
}
