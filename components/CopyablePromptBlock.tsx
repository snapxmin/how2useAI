"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

type CopyablePromptBlockProps = ComponentPropsWithoutRef<"pre">;

export function CopyablePromptBlock({ children }: CopyablePromptBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const copyText = async () => {
    const text = preRef.current?.innerText.trim();
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={`not-prose my-6 overflow-hidden rounded-2xl border shadow-sm transition-colors ${
        isDark
          ? "border-slate-700 bg-slate-950"
          : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-2 text-sm ${
          isDark
            ? "border-slate-800 bg-slate-900 text-slate-200"
            : "border-slate-200 bg-slate-50 text-slate-600"
        }`}
      >
        <span className="font-medium">Prompt 模板</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDark((value) => !value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isDark
                ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {isDark ? "浅色" : "深色"}
          </button>
          <button
            type="button"
            onClick={copyText}
            className="rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-700"
          >
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </div>
      <pre
        ref={preRef}
        className={`m-0 overflow-x-auto whitespace-pre-wrap p-4 text-sm leading-7 ${
          isDark ? "text-slate-100" : "text-slate-800"
        }`}
      >
        {children}
      </pre>
    </div>
  );
}
