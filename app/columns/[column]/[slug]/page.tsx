import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/RelatedArticles";
import { SubscribeForm } from "@/components/SubscribeForm";
import {
  getAllColumnArticleParams,
  getColumnArticleBySlug,
  getColumnArticles,
  getColumnConfig,
} from "@/lib/columns";
import { compileMdxContent } from "@/lib/mdx";
import { siteConfig } from "@/lib/config";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { column: string; slug: string };
}

export async function generateStaticParams() {
  return getAllColumnArticleParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getColumnArticleBySlug(params.column, params.slug);
  if (!article) return { title: "文章未找到" };

  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    keywords: article.frontmatter.tags,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: "article",
      publishedTime: article.frontmatter.date,
      modifiedTime: article.frontmatter.updated ?? article.frontmatter.date,
      tags: article.frontmatter.tags,
    },
  };
}

export default async function ColumnArticlePage({ params }: PageProps) {
  const config = getColumnConfig(params.column);
  const article = getColumnArticleBySlug(params.column, params.slug);
  if (!config || !article) notFound();

  const { frontmatter } = article;
  const content = await compileMdxContent(article.content);
  const related = getColumnArticles(params.column)
    .filter((item) => item.slug !== article.slug)
    .filter(
      (item) =>
        item.frontmatter.topic === frontmatter.topic ||
        item.frontmatter.tags.some((tag) => frontmatter.tags.includes(tag))
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
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: config.name,
    },
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
          { label: "深度专栏", href: "/columns" },
          { label: config.name, href: `/columns/${config.id}` },
          { label: frontmatter.title },
        ]}
      />

      <header>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-violet-50 px-3 py-1 font-semibold text-violet-700">
            {frontmatter.topic}
          </span>
          {frontmatter.episode !== undefined && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
              第 {frontmatter.episode} 期
            </span>
          )}
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
      </header>

      <div className="prose prose-slate prose-headings:font-semibold prose-a:text-violet-600 mt-10 max-w-none">
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
          <h2 className="text-xl font-bold text-slate-950">专栏内继续阅读</h2>
          <div className="mt-5 grid gap-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/columns/${params.column}/${item.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <span className="text-xs font-semibold text-violet-700">
                  {item.frontmatter.topic}
                </span>
                <h3 className="mt-2 font-bold text-slate-900 group-hover:text-violet-700">
                  {item.frontmatter.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-950">订阅专栏更新</h2>
        <p className="mt-2 text-sm text-slate-600">
          追踪 AI4SE 与 AI for DevOps 的最新进展。
        </p>
        <div className="mt-5">
          <SubscribeForm />
        </div>
      </div>
    </article>
  );
}
