import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, RelatedArticles } from "@/components/RelatedArticles";
import { SceneBadge } from "@/components/SceneBadge";
import { SubscribeForm } from "@/components/SubscribeForm";
import { siteConfig } from "@/lib/config";
import { getAllGuideSlugs, getGuideBySlug, getGuidesByRole } from "@/lib/guides";
import { compileMdxContent } from "@/lib/mdx";
import { formatDate, getRoleName } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return { title: "文章未找到" };

  return {
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    keywords: guide.frontmatter.tags,
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      type: "article",
      publishedTime: guide.frontmatter.date,
      modifiedTime: guide.frontmatter.updated ?? guide.frontmatter.date,
      tags: guide.frontmatter.tags,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const content = await compileMdxContent(guide.content);
  const relatedGuides = getGuidesByRole(guide.frontmatter.role);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.frontmatter.title,
    description: guide.frontmatter.description,
    datePublished: guide.frontmatter.date,
    dateModified: guide.frontmatter.updated ?? guide.frontmatter.date,
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
          { label: "入门指南", href: "/guides" },
          { label: guide.frontmatter.title },
        ]}
      />

      <header>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <SceneBadge scene={guide.frontmatter.scene} />
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
            {getRoleName(guide.frontmatter.role)}
          </span>
          <span>发布于 {formatDate(guide.frontmatter.date)}</span>
          {guide.frontmatter.updated && (
            <span>· 更新于 {formatDate(guide.frontmatter.updated)}</span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {guide.frontmatter.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {guide.frontmatter.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {guide.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-slate prose-headings:font-semibold prose-a:text-brand-600 mt-10 max-w-none">
        {content}
      </div>

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">喜欢这篇文章？</h3>
        <p className="mt-2 text-sm text-slate-600">
          订阅我们的周报，获取更多 AI 实战技巧
        </p>
        <div className="mt-4">
          <SubscribeForm />
        </div>
      </div>

      <RelatedArticles guides={relatedGuides} currentSlug={params.slug} />
    </article>
  );
}
