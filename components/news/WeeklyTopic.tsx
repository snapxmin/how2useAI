import Link from "next/link";
import { isSafeExternalUrl } from "@/lib/news";
import type { Guide, Insight, NewsItem, WeeklyTopicConfig } from "@/lib/types";

export function WeeklyTopic(_props: {
  topic?: WeeklyTopicConfig;
  insights: Insight[];
  news: NewsItem[];
  guides: Guide[];
}) {
  const { topic, insights, news, guides } = _props;
  if (!topic) return null;

  const topicInsights = topic.insightSlugs
    .map((slug) => insights.find((item) => item.slug === slug))
    .filter((item): item is Insight => Boolean(item));
  const topicNews = topic.newsIds
    .map((id) => news.find((item) => item.id === id))
    .filter((item): item is NewsItem => Boolean(item))
    .filter((item) => isSafeExternalUrl(item.url));
  const topicGuides = topic.guideSlugs
    .map((slug) => guides.find((item) => item.slug === slug))
    .filter((item): item is Guide => Boolean(item));

  return (
    <section className="sticky top-24 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
      <div className="border-b border-amber-200 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
          WEEKLY TOPIC
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">{topic.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {topic.description}
        </p>
      </div>
      <div className="space-y-4 p-5">
        {topicInsights.map((item) => (
          <Link
            key={item.slug}
            href={`/news/insights/${item.slug}`}
            className="group block rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span className="text-xs font-medium text-amber-700">深度解读</span>
            <h3 className="mt-1 text-sm font-semibold leading-relaxed text-slate-800 group-hover:text-brand-700">
              {item.frontmatter.title}
            </h3>
          </Link>
        ))}
        {topicGuides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span className="text-xs font-medium text-amber-700">实战指南</span>
            <h3 className="mt-1 text-sm font-semibold leading-relaxed text-slate-800 group-hover:text-brand-700">
              {guide.frontmatter.title}
            </h3>
          </Link>
        ))}
        {topicNews.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span className="text-xs font-medium text-amber-700">
              {item.source} ↗
            </span>
            <h3 className="mt-1 text-sm font-semibold leading-relaxed text-slate-800 group-hover:text-brand-700">
              {item.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}
