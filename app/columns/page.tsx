import type { Metadata } from "next";
import { Breadcrumb } from "@/components/RelatedArticles";
import { ColumnCard } from "@/components/columns/ColumnCard";
import { getAllColumnConfigs } from "@/lib/columns";

export const metadata: Metadata = {
  title: "深度专栏",
  description:
    "系统追踪 AI 软件工程、智能运维与 DevOps 领域的业界进展与落地实践",
};

export default function ColumnsPage() {
  const columns = getAllColumnConfigs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "深度专栏" }]} />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          COLUMNS
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
          深度专栏
        </h1>
        <p className="mt-3 text-slate-600">
          围绕特定主题持续更新的系列内容，帮你建立对 AI 工程与运维领域的系统性认知。
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {columns.map((config) => (
          <ColumnCard key={config.id} config={config} />
        ))}
      </div>
    </div>
  );
}
