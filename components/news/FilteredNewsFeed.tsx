"use client";

import type { NewsItem } from "@/lib/types";
import {
  filterNewsByCategory,
  getNewsCategoriesFromItems,
} from "@/lib/news-utils";
import { NewsFeed } from "./NewsFeed";
import { useActiveNewsCategory } from "./NewsCategoryNavClient";

export function FilteredNewsFeed(_props: { items: NewsItem[] }) {
  const { items } = _props;
  const categories = getNewsCategoriesFromItems(items);
  const activeCategory = useActiveNewsCategory(categories);
  return <NewsFeed items={filterNewsByCategory(items, activeCategory)} />;
}
