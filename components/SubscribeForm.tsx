"use client";

import { useState } from "react";

interface SubscribeFormProps {
  variant?: "default" | "compact";
}

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const subscribeEmail = "subscribe@example.com";

export function SubscribeForm({ variant = "default" }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    if (isStaticExport) {
      window.location.href = `mailto:${subscribeEmail}?subject=${encodeURIComponent("订阅如何用好AI")}&body=${encodeURIComponent(`请将我加入邮件列表：${email}`)}`;
      setStatus("success");
      setEmail("");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        订阅成功！感谢关注，我们会定期发送 AI 实战技巧。
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="你的邮箱"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "订阅"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="输入你的邮箱地址"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {status === "loading" ? "提交中..." : "免费订阅"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-rose-600">请输入有效的邮箱地址</p>
      )}
      <p className="mt-3 text-center text-xs text-slate-500">
        每周一封，分享 AI 实战技巧。随时可取消订阅。
      </p>
    </form>
  );
}
