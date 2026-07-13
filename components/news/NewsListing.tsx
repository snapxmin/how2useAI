"use client";

import { useSearchParams } from "next/navigation";
import { NewsCategoryNav } from "@/components/news/NewsCategoryNav";
import { NewsFeed } from "@/components/news/NewsFeed";
import { filterNewsByCategory } from "@/lib/news-utils";
import type { NewsItem } from "@/lib/types";

interface NewsListingProps {
  allNews: NewsItem[];
  categories: string[];
  showNav?: boolean;
}

function useActiveCategory(categories: string[]) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  return categories.includes(categoryParam) ? categoryParam : "全部";
}

export function NewsCategoryFilter({
  categories,
}: {
  categories: string[];
}) {
  const activeCategory = useActiveCategory(categories);

  return (
    <NewsCategoryNav
      categories={categories}
      activeCategory={activeCategory}
    />
  );
}

export function FilteredNewsFeed({
  allNews,
  categories,
}: NewsListingProps) {
  const activeCategory = useActiveCategory(categories);
  const filteredNews = filterNewsByCategory(allNews, activeCategory);

  return <NewsFeed items={filteredNews} />;
}
