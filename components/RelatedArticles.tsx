import Link from "next/link";
import type { Guide } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

interface RelatedArticlesProps {
  guides: Guide[];
  currentSlug: string;
}

export function RelatedArticles({ guides, currentSlug }: RelatedArticlesProps) {
  const related = guides
    .filter((g) => g.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-semibold text-slate-900">相关文章</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {related.map((guide) => (
          <ArticleCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
