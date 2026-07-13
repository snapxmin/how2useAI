import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/RelatedArticles";
import { BreakingNews } from "@/components/news/BreakingNews";
import { InsightGrid } from "@/components/news/InsightGrid";
import {
  FilteredNewsFeed,
  NewsCategoryFilter,
} from "@/components/news/NewsListing";
import { NewsHero } from "@/components/news/NewsHero";
import { WeeklyTopic } from "@/components/news/WeeklyTopic";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getAllGuides } from "@/lib/guides";
import {
  getAllInsights,
  getFeaturedConfig,
  resolveFeaturedInsights,
} from "@/lib/insights";
import {
  getAllNews,
  getBreakingNewsFromItems,
  getNewsCategoriesFromItems,
} from "@/lib/news";

export const metadata: Metadata = {
  title: "AI 资讯与深度解读",
  description:
    "精选 AI 快讯、大厂关键技术、产品变化与行业趋势解读",
};

export default function NewsPage() {
  const allNews = getAllNews();
  const categories = getNewsCategoriesFromItems(allNews);
  const allInsights = getAllInsights();
  const allGuides = getAllGuides();
  const config = getFeaturedConfig();
  const featured = resolveFeaturedInsights(allInsights, config);

  return (
    <>
      <main className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "资讯" }]} />
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              AI EDITORIAL
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              AI 资讯与深度解读
            </h1>
            <p className="mt-3 text-slate-600">
              不只追踪发生了什么，也解释大厂技术与产品为什么值得关注。
              当前内容截至 2026 年 7 月 13 日完成联网核验。
            </p>
          </div>

          <div className="mt-7">
            <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-200" />}>
              <NewsCategoryFilter categories={categories} />
            </Suspense>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
            <NewsHero insight={featured.hero} />
            <BreakingNews items={getBreakingNewsFromItems(allNews, 4)} />
          </div>

          <section className="mt-14">
            <p className="text-sm font-semibold text-brand-600">INSIGHTS</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              大厂技术与产品拆解
            </h2>
            <div className="mt-6">
              <InsightGrid items={featured.insights} />
            </div>
          </section>

          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
            <section>
              <h2 className="text-2xl font-bold text-slate-950">最新资讯</h2>
              <div className="mt-5">
                <Suspense
                  fallback={
                    <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
                  }
                >
                  <FilteredNewsFeed allNews={allNews} categories={categories} />
                </Suspense>
              </div>
            </section>
            <aside>
              <WeeklyTopic
                topic={config.weeklyTopic}
                insights={allInsights}
                news={allNews}
                guides={allGuides}
              />
            </aside>
          </div>

          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            资讯优先采用官方公告及权威媒体并链接具体原文；未经可靠来源确认的传闻不予收录。
          </div>
        </div>
      </main>

      <section className="bg-slate-950 py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white">订阅每周 AI 精选</h2>
          <p className="mt-2 text-slate-300">
            把重要资讯、技术解读和实战建议一次读完。
          </p>
          <div className="mt-6">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
