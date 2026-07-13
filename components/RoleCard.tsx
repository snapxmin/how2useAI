import Link from "next/link";
import { roles } from "@/lib/config";

export function RoleCard({
  id,
  name,
  description,
  icon,
  color,
}: (typeof roles)[number]) {
  return (
    <Link
      href={`/roles/${id}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity group-hover:opacity-5`}
      />
      <div className="relative">
        <span className="text-3xl">{icon}</span>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600">
          查看指南
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function RoleGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          找到适合你的 AI 用法
        </h2>
        <p className="mt-3 text-slate-600">
          无论你是职场人、开发者、创作者还是企业决策者，都有专属学习路径
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <RoleCard key={role.id} {...role} />
        ))}
      </div>
    </section>
  );
}
