import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/RelatedArticles";
import { SubscribeForm } from "@/components/SubscribeForm";
import { ColumnHero } from "@/components/columns/ColumnHero";
import { ColumnTopicSection } from "@/components/columns/ColumnTopicSection";
import {
  getAllColumnIds,
  getColumnArticles,
  getColumnConfig,
  getFeaturedColumnArticle,
  groupArticlesByTopic,
} from "@/lib/columns";

interface PageProps {
  params: { column: string };
}

export async function generateStaticParams() {
  return getAllColumnIds().map((column) => ({ column }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const config = getColumnConfig(params.column);
  if (!config) return { title: "专栏未找到" };

  return {
    title: config.name,
    description: config.description,
    keywords: ["AI4SE", "AI for DevOps", "AIOps", "平台工程", ...config.topics],
  };
}

export default function ColumnPage({ params }: PageProps) {
  const config = getColumnConfig(params.column);
  if (!config) notFound();

  const articles = getColumnArticles(params.column);
  const featured = getFeaturedColumnArticle(params.column);
  const topicGroups = groupArticlesByTopic(
    articles.filter((item) => item.slug !== featured?.slug)
  );

  return (
    <>
      <main className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Breadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "深度专栏", href: "/columns" },
              { label: config.name },
            ]}
          />

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
              深度专栏
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              {config.name}
            </h1>
            <p className="mt-1 text-lg font-medium text-violet-700">
              {config.subtitle}
            </p>
            <p className="mt-3 text-slate-600">{config.description}</p>
          </div>

          <div className="mt-8">
            <ColumnHero config={config} featured={featured} />
          </div>

          <div className="mt-14 space-y-14">
            {topicGroups.map((group) => (
              <ColumnTopicSection
                key={group.topic}
                topic={group.topic}
                articles={group.articles}
                columnId={config.id}
              />
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            专栏内容基于官方技术博客、行业报告与权威媒体公开信息整理，持续追踪 AI4SE
            与 AI for DevOps 领域的最新动态。
          </div>
        </div>
      </main>

      <section className="bg-slate-950 py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white">订阅专栏更新</h2>
          <p className="mt-2 text-slate-300">
            新一期专栏发布时，第一时间收到通知。
          </p>
          <div className="mt-6">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
