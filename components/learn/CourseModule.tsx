import type { CourseModule as CourseModuleType } from "@/lib/types";
import { LessonCard } from "./LessonCard";

export function CourseModule({ module }: { module: CourseModuleType }) {
  const duration = module.lessons.reduce(
    (total, lesson) => total + lesson.frontmatter.duration,
    0
  );

  return (
    <section id={`module-${module.id}`} className="scroll-mt-28">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-600">
            模块 {module.id}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {module.title}
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {module.lessons.length} 课 · 约 {duration} 分钟
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {module.lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}
