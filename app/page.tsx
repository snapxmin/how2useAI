import Link from "next/link";
import { Hero } from "@/components/Hero";
import { RoleGrid } from "@/components/RoleCard";
import { ArticleCard } from "@/components/ArticleCard";
import { ToolCard } from "@/components/ToolCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { PrinciplesFeature } from "@/components/learn/PrinciplesFeature";
import { getFeaturedGuides } from "@/lib/guides";
import { getFeaturedTools } from "@/lib/tools";

export default function HomePage() {
  const guides = getFeaturedGuides(6);
  const tools = getFeaturedTools(6);

  return (
    <>
      <Hero />
      <RoleGrid />
      <PrinciplesFeature />

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">最新实战指南</h2>
              <p className="mt-2 text-slate-600">场景化教程，手把手教你用好 AI</p>
            </div>
            <Link
              href="/guides"
              className="hidden text-sm font-medium text-brand-600 hover:text-brand-700 sm:block"
            >
              查看全部 →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <ArticleCard key={guide.slug} guide={guide} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/guides"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              查看全部指南 →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">热门 AI 工具</h2>
              <p className="mt-2 text-slate-600">2026 年最值得关注的 AI 工具全景</p>
            </div>
            <Link
              href="/tools"
              className="hidden text-sm font-medium text-brand-600 hover:text-brand-700 sm:block"
            >
              查看工具图谱 →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-950 to-indigo-900 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            订阅每周 AI 实战技巧
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-200">
            获取最新工具评测、Prompt 模板和实战案例，不错过任何 AI 机会
          </p>
          <div className="mt-8">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
