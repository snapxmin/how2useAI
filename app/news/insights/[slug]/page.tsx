import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/RelatedArticles";
import { SubscribeForm } from "@/components/SubscribeForm";
import {
  getAllInsights,
  getAllInsightSlugs,
  getInsightBySlug,
} from "@/lib/insights";
import { compileMdxContent } from "@/lib/mdx";
import { siteConfig } from "@/lib/config";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const insight = getInsightBySlug(params.slug);
  if (!insight) return { title: "解读未找到" };

  return {
    title: insight.frontmatter.title,
    description: insight.frontmatter.description,
    keywords: insight.frontmatter.tags,
    openGraph: {
      title: insight.frontmatter.title,
      description: insight.frontmatter.description,
      type: "article",
      publishedTime: insight.frontmatter.date,
      modifiedTime:
        insight.frontmatter.updated ?? insight.frontmatter.date,
      tags: insight.frontmatter.tags,
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const insight = getInsightBySlug(params.slug);
  if (!insight) notFound();

  const { frontmatter } = insight;
  const content = await compileMdxContent(insight.content);
  const related = getAllInsights()
    .filter((item) => item.slug !== insight.slug)
    .filter(
      (item) =>
        item.frontmatter.category === frontmatter.category ||
        item.frontmatter.companies.some((company) =>
          frontmatter.companies.includes(company)
        )
    )
    .slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated ?? frontmatter.date,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "AI 资讯", href: "/news" },
          { label: frontmatter.title },
        ]}
      />

      <header>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700">
            {frontmatter.insightType}
          </span>
          <time dateTime={frontmatter.date}>
            发布于 {formatDate(frontmatter.date)}
          </time>
          {frontmatter.updated && (
            <time dateTime={frontmatter.updated}>
              · 更新于 {formatDate(frontmatter.updated)}
            </time>
          )}
          <span>· {frontmatter.readingTime} 分钟阅读</span>
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {frontmatter.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[...frontmatter.companies, ...frontmatter.products].map((label) => (
            <span
              key={label}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
            >
              {label}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-slate prose-headings:font-semibold prose-a:text-brand-600 mt-10 max-w-none">
        {content}
      </div>

      <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
        {frontmatter.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-950">继续阅读</h2>
          <div className="mt-5 grid gap-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/news/insights/${item.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <span className="text-xs font-semibold text-brand-700">
                  {item.frontmatter.insightType}
                </span>
                <h3 className="mt-2 font-bold text-slate-900 group-hover:text-brand-700">
                  {item.frontmatter.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-950">每周读懂 AI 关键变化</h2>
        <p className="mt-2 text-sm text-slate-600">
          获取经过筛选的资讯、解读和实战建议。
        </p>
        <div className="mt-5">
          <SubscribeForm />
        </div>
      </div>
    </article>
  );
}
