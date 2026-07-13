import Link from "next/link";
import { SceneBadge } from "@/components/SceneBadge";
import type { Guide } from "@/lib/types";
import { getSceneConfig } from "@/lib/scenes";
import { formatDate, getRoleName } from "@/lib/utils";

interface ArticleCardProps {
  guide: Guide;
}

export function ArticleCard({ guide }: ArticleCardProps) {
  const { slug, frontmatter } = guide;
  const scene = getSceneConfig(frontmatter.scene);

  return (
    <Link
      href={`/guides/${slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-slate-200 border-l-4 bg-white shadow-sm transition-all hover:border-brand-200 hover:shadow-md ${scene.accentClass}`}
    >
      <div className={`flex items-center gap-2 px-5 py-3 ${scene.headerClass}`}>
        <SceneBadge scene={frontmatter.scene} size="sm" className="bg-white/80 ring-0" />
      </div>

      <div className="flex flex-1 flex-col p-5 pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">
            {getRoleName(frontmatter.role)}
          </span>
          <span>{formatDate(frontmatter.date)}</span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900 group-hover:text-brand-700">
          {frontmatter.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {frontmatter.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {frontmatter.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
