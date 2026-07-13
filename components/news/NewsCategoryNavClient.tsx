"use client";

import { useSearchParams } from "next/navigation";
import { NewsCategoryNav } from "./NewsCategoryNav";

// 站点以纯静态方式导出（GitHub Pages），服务端无法读取 searchParams，
// 当前分类在客户端根据 ?category= 参数解析。
export function useActiveNewsCategory(categories: string[]): string {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") ?? "";
  return categories.includes(category) ? category : "全部";
}

export function NewsCategoryNavClient(_props: { categories: string[] }) {
  const { categories } = _props;
  const activeCategory = useActiveNewsCategory(categories);
  return (
    <NewsCategoryNav categories={categories} activeCategory={activeCategory} />
  );
}
