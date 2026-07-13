"use client";

import { useSearchParams } from "next/navigation";
import { NewsCategoryNav } from "@/components/news/NewsCategoryNav";
import { NewsFeed } from "@/components/news/NewsFeed";
import type { NewsItem } from "@/lib/types";

function getActiveCategory(categories: string[], category: string | null) {
  return category && categories.includes(category) ? category : "全部";
}

export function NewsCategoryFilter(_props: { categories: string[] }) {
  const { categories } = _props;
  const searchParams = useSearchParams();
  const activeCategory = getActiveCategory(categories, searchParams.get("category"));

  return (
    <NewsCategoryNav categories={categories} activeCategory={activeCategory} />
  );
}

export function FilteredNewsFeed(_props: {
  categories: string[];
  items: NewsItem[];
}) {
  const { categories, items } = _props;
  const searchParams = useSearchParams();
  const activeCategory = getActiveCategory(categories, searchParams.get("category"));
  const filteredItems =
    activeCategory === "全部"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return <NewsFeed items={filteredItems} />;
}
