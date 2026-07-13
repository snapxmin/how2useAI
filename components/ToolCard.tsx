import Link from "next/link";
import type { Tool } from "@/lib/types";
import { getPricingLabel } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
}

const pricingColors: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700",
  freemium: "bg-amber-50 text-amber-700",
  paid: "bg-rose-50 text-rose-700",
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-slate-900">{tool.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pricingColors[tool.pricing]}`}
        >
          {getPricingLabel(tool.pricing)}
        </span>
      </div>
      <span className="mt-1 text-xs text-slate-500">{tool.category}</span>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {tool.description}
      </p>
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        访问官网
        <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

export function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
