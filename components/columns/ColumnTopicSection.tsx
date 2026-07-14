import type { ColumnArticle, ColumnTopic } from "@/lib/types";
import { ColumnArticleCard } from "./ColumnArticleCard";

export function ColumnTopicSection({
  topic,
  articles,
  columnId,
}: {
  topic: ColumnTopic;
  articles: ColumnArticle[];
  columnId: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">{topic}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ColumnArticleCard
            key={article.slug}
            article={article}
            columnId={columnId}
          />
        ))}
      </div>
    </section>
  );
}
