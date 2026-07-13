import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-900 px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      <div className="relative mx-auto max-w-4xl text-center">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-200 backdrop-blur-sm">
          中文 AI 实战指南门户
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          如何用好
          <span className="bg-gradient-to-r from-brand-300 to-indigo-300 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-100 sm:text-xl">
          不只介绍工具，更教你「在什么场景下、怎么用、能省多少时间」。
          分角色导航，帮你把 AI 真正用起来。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/guides"
            className="w-full rounded-xl bg-white px-8 py-3.5 text-center text-base font-semibold text-brand-800 shadow-lg transition-transform hover:scale-105 sm:w-auto"
          >
            开始入门
          </Link>
          <Link
            href="/tools"
            className="w-full rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-center text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
          >
            浏览工具图谱
          </Link>
        </div>
      </div>
    </section>
  );
}
