import Link from "next/link";
import { siteConfig, roles } from "@/lib/config";
import { SubscribeForm } from "./SubscribeForm";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-bold text-white">
                AI
              </span>
              <span className="text-lg font-semibold text-slate-900">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">分角色导航</h3>
            <ul className="mt-3 space-y-2">
              {roles.map((role) => (
                <li key={role.id}>
                  <Link
                    href={`/roles/${role.id}`}
                    className="text-sm text-slate-600 hover:text-brand-600"
                  >
                    {role.icon} {role.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">系统学习</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/learn" className="text-sm text-slate-600 hover:text-brand-600">
                  AI 原理课
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-slate-600 hover:text-brand-600">
                  实战指南
                </Link>
              </li>
              <li>
                <Link href="/prompts" className="text-sm text-slate-600 hover:text-brand-600">
                  Prompt 库
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">订阅更新</h3>
            <p className="mt-2 text-sm text-slate-600">
              每周获取 AI 实战技巧与工具推荐
            </p>
            <div className="mt-3">
              <SubscribeForm variant="compact" />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. 内容持续更新中。
          </p>
        </div>
      </div>
    </footer>
  );
}
