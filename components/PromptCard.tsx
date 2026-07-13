import type { Prompt } from "@/lib/types";
import { getRoleName } from "@/lib/utils";

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          {getRoleName(prompt.role)}
        </span>
        <span className="text-xs text-slate-500">{prompt.category}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900">
        {prompt.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{prompt.description}</p>
      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {prompt.content}
        </pre>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
