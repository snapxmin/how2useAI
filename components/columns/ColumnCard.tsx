import Link from "next/link";
import type { ColumnConfig } from "@/lib/types";

const themeAccent: Record<ColumnConfig["heroTheme"], string> = {
  violet: "border-violet-200 bg-violet-50 hover:border-violet-300",
  indigo: "border-indigo-200 bg-indigo-50 hover:border-indigo-300",
  emerald: "border-emerald-200 bg-emerald-50 hover:border-emerald-300",
  slate: "border-slate-200 bg-slate-50 hover:border-slate-300",
};

export function ColumnCard({ config }: { config: ColumnConfig }) {
  return (
    <Link
      href={`/columns/${config.id}`}
      className={`group block rounded-2xl border p-6 transition-colors ${themeAccent[config.heroTheme]}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
        深度专栏
      </p>
      <h2 className="mt-2 text-xl font-bold text-slate-950 group-hover:text-violet-800">
        {config.name}
      </h2>
      <p className="mt-1 text-sm font-medium text-violet-700">{config.subtitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {config.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {config.topics.slice(0, 4).map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-white px-2.5 py-0.5 text-xs text-slate-600"
          >
            {topic}
          </span>
        ))}
      </div>
    </Link>
  );
}
