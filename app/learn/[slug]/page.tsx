import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseSidebar } from "@/components/learn/CourseSidebar";
import { LessonNavigation } from "@/components/learn/LessonNavigation";
import { LessonToc } from "@/components/learn/LessonToc";
import {
  CompleteLessonButton,
  LessonVisitTracker,
} from "@/components/learn/LearningProgress";
import {
  getAllLessons,
  getAllLessonSlugs,
  getLessonBySlug,
  getLessonNavigation,
  groupLessonsByModule,
} from "@/lib/learn";
import { compileMdxContent } from "@/lib/mdx";
import { extractLessonToc } from "@/lib/mdx-utils";
import { siteConfig } from "@/lib/config";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) return { title: "课程未找到" };
  return {
    title: lesson.frontmatter.title,
    description: lesson.frontmatter.description,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) notFound();

  const lessons = getAllLessons();
  const modules = groupLessonsByModule(lessons);
  const navigation = getLessonNavigation(lessons, lesson.slug);
  const toc = extractLessonToc(lesson.content);
  const content = await compileMdxContent(lesson.content, { lesson: true });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.frontmatter.title,
    description: lesson.frontmatter.description,
    timeRequired: `PT${lesson.frontmatter.duration}M`,
    provider: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      <LessonVisitTracker slug={lesson.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <details className="mb-6 rounded-xl border border-slate-200 bg-white p-4 lg:hidden">
        <summary className="cursor-pointer font-semibold text-slate-800">
          打开课程目录
        </summary>
        <div className="mt-4">
          <CourseSidebar modules={modules} currentSlug={lesson.slug} />
        </div>
      </details>

      <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,48rem)_12rem] lg:items-start lg:justify-center">
        <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 lg:block">
          <CourseSidebar modules={modules} currentSlug={lesson.slug} />
        </aside>

        <main className="min-w-0">
          <header className="border-b border-slate-200 pb-8">
            <p className="text-sm font-semibold text-brand-600">
              模块 {lesson.frontmatter.module} · 第 {lesson.frontmatter.order} 课
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              {lesson.frontmatter.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {lesson.frontmatter.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                约 {lesson.frontmatter.duration} 分钟
              </span>
              {lesson.frontmatter.prerequisites.length > 0 && (
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  前置：{lesson.frontmatter.prerequisites.join("、")}
                </span>
              )}
            </div>
            <div className="mt-6 rounded-xl bg-brand-50 p-5">
              <h2 className="text-sm font-semibold text-brand-900">学完你将能够</h2>
              <ul className="mt-2 space-y-1 text-sm text-brand-900">
                {lesson.frontmatter.objectives.map((objective) => (
                  <li key={objective}>✓ {objective}</li>
                ))}
              </ul>
            </div>
          </header>

          <div className="prose prose-slate mt-10 max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-brand-600">
            {content}
          </div>

          <LessonNavigation
            previous={navigation.previous}
            next={navigation.next}
            completion={<CompleteLessonButton slug={lesson.slug} />}
          />
        </main>

        <aside className="sticky top-24 hidden lg:block">
          <LessonToc items={toc} />
        </aside>
      </div>
    </div>
  );
}
