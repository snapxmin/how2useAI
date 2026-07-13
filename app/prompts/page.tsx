import type { Metadata } from "next";
import { Breadcrumb } from "@/components/RelatedArticles";
import { PromptCard } from "@/components/PromptCard";
import { getAllPrompts } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "Prompt 库",
  description: "精选 AI Prompt 模板，覆盖职场、开发、创作、企业四大场景，复制即用",
};

export default function PromptsPage() {
  const prompts = getAllPrompts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "Prompt 库" }]} />

      <h1 className="text-3xl font-bold text-slate-900">Prompt 库</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        精选 10+ 条实战 Prompt 模板，按场景分类。每条 Prompt 都经过验证，复制到 ChatGPT、Claude 或国内大模型即可使用。
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900">想要更多 Prompt？</h3>
        <p className="mt-2 text-sm text-slate-600">
          订阅我们的周报，每周获取 5 条精选 Prompt 模板
        </p>
      </div>
    </div>
  );
}
