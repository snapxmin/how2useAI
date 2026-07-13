import type { Metadata } from "next";
import Link from "next/link";
import { CourseModule } from "@/components/learn/CourseModule";
import { LearningProgress } from "@/components/learn/LearningProgress";
import { getAllLessons, groupLessonsByModule } from "@/lib/learn";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI 原理课",
  description: "面向零基础读者，用 12 课理解大模型、Prompt、RAG 与 Agent 的工作原理。",
};

export default function LearnPage() {
  const lessons = getAllLessons();
  const modules = groupLessonsByModule(lessons);
  const totalDuration = lessons.reduce(
    (total, lesson) => total + lesson.frontmatter.duration,
    0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "AI 原理课",
    description: metadata.description,
    provider: { "@type": "Organization", name: siteConfig.name },
    numberOfCredits: lessons.length,
    timeRequired: `PT${totalDuration}M`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-gradient-to-br from-brand-950 via-indigo-950 to-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold text-brand-200">零基础 · 系统课程</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">AI 原理课</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            不背术语，不钻公式。从日常类比出发，理解大模型、Prompt、RAG 和
            Agent 为什么这样工作，再把原理变成真正好用的方法。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-brand-100">
            <span className="rounded-full bg-white/10 px-4 py-2">{lessons.length} 课</span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              约 {totalDuration} 分钟
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">无需技术背景</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <LearningProgress lessonSlugs={lessons.map((lesson) => lesson.slug)} />
        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href={lessons[0] ? `/learn/${lessons[0].slug}` : "/learn"}
            className="rounded-2xl border border-brand-200 bg-brand-50 p-6 hover:border-brand-400"
          >
            <p className="text-sm font-semibold text-brand-700">推荐路线</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">从零开始顺序学习</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              从 AI 与传统软件的区别开始，逐步走到 Agent 与人机协作。
            </p>
          </Link>
          <Link
            href={lessons.find((lesson) => lesson.slug === "agent-loop") ? "/learn/agent-loop" : "/learn"}
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300"
          >
            <p className="text-sm font-semibold text-slate-500">快捷路线</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">只想理解 Agent</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              直接了解工具调用、规划执行和反馈循环，再按需补齐前置知识。
            </p>
          </Link>
        </section>

        <div className="mt-14 space-y-14">
          {modules.map((module) => (
            <CourseModule key={module.id} module={module} />
          ))}
        </div>
      </main>
    </>
  );
}
