import Link from "next/link";

const topics = ["大模型", "Prompt", "RAG", "Agent"];

export function PrinciplesFeature() {
  return (
    <section className="bg-slate-950 py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-brand-300">AI 原理课</p>
          <h2 className="mt-2 text-3xl font-bold">不只会用，更要理解为什么</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            用通俗类比理解模型怎样生成答案、为什么会幻觉、知识库如何检索，
            以及 Agent 怎样调用工具完成任务。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-slate-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-brand-900 shadow-lg hover:bg-brand-50"
        >
          开始 AI 原理课 →
        </Link>
      </div>
    </section>
  );
}
