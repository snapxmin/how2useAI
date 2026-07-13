import type { Metadata } from "next";
import { Breadcrumb } from "@/components/RelatedArticles";
import { ToolGrid } from "@/components/ToolCard";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "2026 AI 工具图谱",
  description:
    "2026 年最全面的 AI 工具全景图，覆盖对话、编程、设计、视频、企业应用等类别，帮你快速选型",
};

const categories = [
  "全部",
  "对话助手",
  "编程开发",
  "设计创作",
  "视频音频",
  "办公效率",
  "企业服务",
  "国内大模型",
];

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "工具图谱" }]} />

      <h1 className="text-3xl font-bold text-slate-900">2026 AI 工具图谱</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        精选 15+ 款主流 AI 工具，按类别整理。每款工具标注定价模式与适用角色，帮你快速找到合适的工具。
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600"
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <ToolGrid tools={tools} />
      </div>

      <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        <strong>免责声明：</strong>
        工具信息基于公开资料整理，定价和功能可能随时变化。我们会在每季度更新本页面。
        部分工具链接未来可能包含联盟分成，届时会在此标注。
      </div>
    </div>
  );
}
