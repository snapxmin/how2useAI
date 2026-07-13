import Link from "next/link";

export function NewsCategoryNav(_props: {
  categories: string[];
  activeCategory: string;
}) {
  const { categories, activeCategory } = _props;

  return (
    <nav
      aria-label="资讯分类"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
    >
      {categories.map((category) => {
        const active = category === activeCategory;
        const href =
          category === "全部"
            ? "/news"
            : `/news?category=${encodeURIComponent(category)}`;
        return (
          <Link
            key={category}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
              active
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700"
            }`}
          >
            {category}
          </Link>
        );
      })}
    </nav>
  );
}
