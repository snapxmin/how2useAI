import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Guide, GuideFrontmatter } from "./types";

const guidesDirectory = path.join(process.cwd(), "content/guides");

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(guidesDirectory);
  const guides = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(guidesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: data as GuideFrontmatter,
        content,
      };
    });

  return guides.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getGuideBySlug(slug: string): Guide | null {
  const fullPath = path.join(guidesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as GuideFrontmatter,
    content,
  };
}

export function getGuidesByRole(role: string): Guide[] {
  return getAllGuides().filter((guide) => guide.frontmatter.role === role);
}

export function getFeaturedGuides(limit = 6): Guide[] {
  const guides = getAllGuides();
  const featured = guides.filter((g) => g.frontmatter.featured);
  return (featured.length > 0 ? featured : guides).slice(0, limit);
}

export function getAllGuideSlugs(): string[] {
  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }
  return fs
    .readdirSync(guidesDirectory)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""));
}
