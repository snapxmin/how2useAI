import Link from "next/link";
import type { CourseModule } from "@/lib/types";

export function CourseSidebar({
  modules,
  currentSlug,
}: {
  modules: CourseModule[];
  currentSlug: string;
}) {
  return (
    <nav aria-label="课程目录">
      <Link href="/learn" className="text-sm font-semibold text-brand-700">
        ← 课程总览
      </Link>
      <div className="mt-5 space-y-5">
        {modules.map((module) => (
          <section key={module.id}>
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
              模块 {module.id} · {module.title}
            </h2>
            <ol className="mt-2 space-y-1">
              {module.lessons.map((lesson) => {
                const active = lesson.slug === currentSlug;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/learn/${lesson.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm leading-5 ${
                        active
                          ? "bg-brand-50 font-semibold text-brand-800"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {lesson.frontmatter.order}. {lesson.frontmatter.title}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </nav>
  );
}
