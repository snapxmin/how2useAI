import type { Metadata } from "next";
import { Breadcrumb } from "@/components/RelatedArticles";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "订阅",
  description: "订阅如何用好AI周报，每周获取 AI 实战技巧、工具评测和 Prompt 模板",
};

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "订阅" }]} />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">订阅 AI 实战周报</h1>
        <p className="mx-auto mt-4 max-w-lg text-slate-600">
          每周一封邮件，精选 AI 实战技巧、最新工具评测和 Prompt 模板。
          帮助你在 AI 时代保持领先。
        </p>
      </div>

      <div className="mt-10">
        <SubscribeForm />
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-center text-lg font-semibold text-slate-900">
          你将收到什么？
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "📖",
              title: "实战教程",
              desc: "场景化 AI 使用技巧，每周 1-2 篇精华",
            },
            {
              icon: "🔧",
              title: "工具速递",
              desc: "最新 AI 工具评测与对比，帮你选型",
            },
            {
              icon: "✨",
              title: "Prompt 模板",
              desc: "精选 Prompt，复制即用，提升效率",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
