import type { LessonTocItem } from "@/lib/types";

export function LessonToc({ items }: { items: LessonTocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="本课目录">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        本课目录
      </p>
      <ul className="mt-3 space-y-2 border-l border-slate-200">
        {items.map((item) => (
          <li key={`${item.level}-${item.id}`} className={item.level === 3 ? "pl-6" : "pl-3"}>
            <a
              href={`#${item.id}`}
              className="text-sm leading-5 text-slate-600 hover:text-brand-700"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
