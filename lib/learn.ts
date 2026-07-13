import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CourseModule, Lesson, LessonFrontmatter } from "./types";

const lessonsDirectory = path.join(process.cwd(), "content/learn");
const requiredFields: (keyof LessonFrontmatter)[] = [
  "title",
  "description",
  "module",
  "moduleTitle",
  "order",
  "duration",
  "prerequisites",
  "objectives",
];

export function validateAndSortLessons(lessons: Lesson[]): Lesson[] {
  const positions = new Set<string>();

  for (const lesson of lessons) {
    for (const field of requiredFields) {
      const value = lesson.frontmatter[field];
      const missing =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && field === "objectives" && value.length === 0);

      if (missing) {
        throw new Error(
          `content/learn/${lesson.slug}.mdx: 缺少必填字段 ${field}`
        );
      }
    }

    const position = `${lesson.frontmatter.module}:${lesson.frontmatter.order}`;
    if (positions.has(position)) {
      throw new Error(
        `课程顺序重复: module ${lesson.frontmatter.module}, order ${lesson.frontmatter.order}`
      );
    }
    positions.add(position);
  }

  return [...lessons].sort(
    (a, b) =>
      a.frontmatter.module - b.frontmatter.module ||
      a.frontmatter.order - b.frontmatter.order
  );
}

export function groupLessonsByModule(lessons: Lesson[]): CourseModule[] {
  const modules = new Map<number, CourseModule>();

  for (const lesson of validateAndSortLessons(lessons)) {
    const id = lesson.frontmatter.module;
    const current = modules.get(id);
    if (current) {
      current.lessons.push(lesson);
    } else {
      modules.set(id, {
        id,
        title: lesson.frontmatter.moduleTitle,
        lessons: [lesson],
      });
    }
  }

  return Array.from(modules.values());
}

export function getLessonNavigation(lessons: Lesson[], slug: string) {
  const sorted = validateAndSortLessons(lessons);
  const index = sorted.findIndex((lesson) => lesson.slug === slug);

  return {
    previous: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export function getAllLessons(): Lesson[] {
  if (!fs.existsSync(lessonsDirectory)) return [];

  const lessons = fs
    .readdirSync(lessonsDirectory)
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fileContents = fs.readFileSync(
        path.join(lessonsDirectory, fileName),
        "utf8"
      );
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: data as LessonFrontmatter,
        content,
      };
    });

  return validateAndSortLessons(lessons);
}

export function getLessonBySlug(slug: string): Lesson | null {
  return getAllLessons().find((lesson) => lesson.slug === slug) ?? null;
}

export function getAllLessonSlugs(): string[] {
  return getAllLessons().map((lesson) => lesson.slug);
}
