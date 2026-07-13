import type { NewsItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-medium text-brand-700">
          {item.category}
        </span>
        <span>{formatDate(item.date)}</span>
        <span className="text-slate-400">·</span>
        <span>{item.source}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900 group-hover:text-brand-700">
        {item.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
        {item.summary}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="inline-flex shrink-0 items-center text-sm font-medium text-brand-600 group-hover:text-brand-700">
          阅读原文
          <svg
            className="ml-1 h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}

export function NewsGrid({ items }: { items: NewsItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
