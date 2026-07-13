import type { NewsItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BreakingNews(_props: { items: NewsItem[] }) {
  const { items } = _props;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            BREAKING
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">最新快讯</h2>
        </div>
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          持续更新
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          暂无快讯
        </p>
      ) : (
        <ol className="mt-4 divide-y divide-slate-100">
          {items.slice(0, 4).map((item) => (
            <li key={item.id} className="py-4 first:pt-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  <span>·</span>
                  <span>{item.source}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold leading-relaxed text-slate-800 group-hover:text-brand-700">
                  {item.title}
                  <span className="ml-1 text-slate-400" aria-hidden="true">
                    ↗
                  </span>
                </h3>
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
