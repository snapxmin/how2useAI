import Link from "next/link";
import type { Insight } from "@/lib/types";

export function InsightGrid({ items }: { items: Insight[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.slice(0, 3).map((item) => (
        <Link
          key={item.slug}
          href={`/news/insights/${item.slug}`}
          className="group flex min-h-64 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-brand-700">
              {item.frontmatter.insightType}
            </span>
            <span className="text-slate-500">
              {item.frontmatter.readingTime} 分钟
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 group-hover:text-brand-700">
            {item.frontmatter.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
            {item.frontmatter.description}
          </p>
          <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            {item.frontmatter.companies.join(" · ")}
            {item.frontmatter.products.length > 0 && (
              <span> / {item.frontmatter.products.join(" · ")}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
