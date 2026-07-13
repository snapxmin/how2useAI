import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumb } from "@/components/RelatedArticles";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "入门指南",
  description: "从零开始学习如何用好 AI，覆盖职场、开发、创作、企业四大场景",
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "入门指南" }]} />
      <h1 className="text-3xl font-bold text-slate-900">入门指南</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        精选 AI 实战教程，按场景分类，帮你快速上手。每篇文章都包含可复现的步骤和真实案例。
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <ArticleCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </div>
  );
}
