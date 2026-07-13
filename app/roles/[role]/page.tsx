import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { LearningPathTimeline } from "@/components/LearningPathTimeline";
import { Breadcrumb } from "@/components/RelatedArticles";
import { ToolCard } from "@/components/ToolCard";
import { roles } from "@/lib/config";
import { getGuidesByRole } from "@/lib/guides";
import { getToolsByRole } from "@/lib/tools";

interface PageProps {
  params: { role: string };
}

const learningPaths: Record<
  string,
  { day: number; title: string; description: string; level: string }[]
> = {
  workplace: [
    {
      day: 7,
      level: "入门",
      title: "7 天职场 AI 入门",
      description: "掌握邮件、会议纪要、数据分析三大场景",
    },
    {
      day: 14,
      level: "进阶",
      title: "14 天效率提升计划",
      description: "建立个人 AI 工作流，日均节省 1 小时",
    },
    {
      day: 30,
      level: "精通",
      title: "30 天 AI 办公专家",
      description: "精通汇报、PPT、跨部门协作等高级场景",
    },
  ],
  developer: [
    {
      day: 7,
      level: "入门",
      title: "7 天 AI 编程入门",
      description: "从 Copilot 到 Cursor，快速上手 AI 辅助开发",
    },
    {
      day: 14,
      level: "进阶",
      title: "14 天 Agent 实战",
      description: "构建你的第一个 AI Agent 应用",
    },
    {
      day: 30,
      level: "精通",
      title: "30 天 AI 工程化",
      description: "RAG、API 集成、生产级部署全流程",
    },
  ],
  creator: [
    {
      day: 7,
      level: "入门",
      title: "7 天 AI 创作入门",
      description: "文案、图片、视频三大创作场景",
    },
    {
      day: 14,
      level: "进阶",
      title: "14 天内容生产流",
      description: "建立从创意到发布的 AI 内容流水线",
    },
    {
      day: 30,
      level: "精通",
      title: "30 天创意大师",
      description: "品牌视觉、短视频、多平台运营",
    },
  ],
  enterprise: [
    {
      day: 7,
      level: "认知",
      title: "7 天企业 AI 认知",
      description: "了解 AI 能力边界，识别落地场景",
    },
    {
      day: 14,
      level: "试点",
      title: "14 天选型与试点",
      description: "工具对比、小范围试点、ROI 测算",
    },
    {
      day: 30,
      level: "落地",
      title: "30 天团队落地",
      description: "培训体系、合规流程、规模化推广",
    },
  ],
};

export async function generateStaticParams() {
  return roles.map((role) => ({ role: role.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const role = roles.find((r) => r.id === params.role);
  if (!role) return { title: "页面未找到" };

  return {
    title: `${role.name} - AI 实战指南`,
    description: role.description,
  };
}

export default function RolePage({ params }: PageProps) {
  const role = roles.find((r) => r.id === params.role);
  if (!role) notFound();

  const guides = getGuidesByRole(params.role);
  const tools = getToolsByRole(params.role);
  const paths = learningPaths[params.role] ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: role.name },
        ]}
      />

      <div className="flex items-center gap-4">
        <span className="text-4xl">{role.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{role.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">{role.description}</p>
        </div>
      </div>

      {paths.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">学习路径</h2>
              <p className="mt-1 text-sm text-slate-500">
                从入门到精通，按里程碑逐步跃迁你的 AI 能力
              </p>
            </div>
          </div>
          <LearningPathTimeline steps={paths} />
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">实战指南</h2>
        {guides.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <ArticleCard key={guide.slug} guide={guide} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-slate-500">内容更新中，敬请期待。</p>
        )}
      </section>

      {tools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">推荐工具</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
