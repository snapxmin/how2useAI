import type { ReactNode } from "react";

type CardKind = "concept" | "analogy" | "warning" | "practice";

const styles: Record<CardKind, { label: string; className: string }> = {
  concept: {
    label: "核心概念",
    className: "border-indigo-200 bg-indigo-50 text-indigo-950",
  },
  analogy: {
    label: "通俗类比",
    className: "border-sky-200 bg-sky-50 text-sky-950",
  },
  warning: {
    label: "常见误解",
    className: "border-amber-200 bg-amber-50 text-amber-950",
  },
  practice: {
    label: "动手试试",
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
};

function TeachingCard({
  kind,
  title,
  children,
}: {
  kind: CardKind;
  title?: string;
  children: ReactNode;
}) {
  const style = styles[kind];
  return (
    <aside className={`not-prose my-6 rounded-2xl border p-5 ${style.className}`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-70">
        {style.label}
      </p>
      {title && <h3 className="mt-1 font-semibold">{title}</h3>}
      <div className="mt-2 text-sm leading-7">{children}</div>
    </aside>
  );
}

export function ConceptCard(props: { title?: string; children: ReactNode }) {
  return <TeachingCard kind="concept" {...props} />;
}

export function AnalogyCard(props: { title?: string; children: ReactNode }) {
  return <TeachingCard kind="analogy" {...props} />;
}

export function Misconception(props: { title?: string; children: ReactNode }) {
  return <TeachingCard kind="warning" {...props} />;
}

export function PracticeTip(props: { title?: string; children: ReactNode }) {
  return <TeachingCard kind="practice" {...props} />;
}
