import type { NewsItem } from "@/lib/types";
import { isSafeExternalUrl } from "@/lib/news";
import { formatDate } from "@/lib/utils";

export function NewsFeed(_props: { items: NewsItem[] }) {
  const { items } = _props;
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">
        暂无该分类资讯
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-5 sm:px-6">
      {items.map((item) => {
        const content = (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-brand-700">{item.category}</span>
              <time dateTime={item.date}>{formatDate(item.date)}</time>
              <span>·</span>
              <span>{item.source}</span>
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-brand-700">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:block">
              {item.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        );

        return isSafeExternalUrl(item.url) ? (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block py-6 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
          >
            {content}
            <span className="mt-3 inline-block text-xs font-medium text-slate-400">
              阅读官方来源 ↗
            </span>
          </a>
        ) : (
          <article key={item.id} className="py-6">
            {content}
          </article>
        );
      })}
    </div>
  );
}
