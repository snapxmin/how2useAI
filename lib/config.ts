import type { Metadata } from "next";

export const siteConfig = {
  name: "如何用好AI",
  description:
    "中文场景下，帮不同角色把 AI 真正用起来 — 实战指南、工具评测、Prompt 库与学习路径",
  url: "https://ai-how-to-use.vercel.app",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com",
  },
};

export const roles = [
  {
    id: "workplace",
    name: "职场效率",
    description: "写邮件、做汇报、数据分析、会议纪要，让 AI 成为你的办公助手",
    icon: "💼",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "developer",
    name: "开发编程",
    description: "Cursor、Copilot、Agent、RAG，提升开发效率的 AI 工程实践",
    icon: "💻",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "creator",
    name: "设计创作",
    description: "Midjourney、视频生成、文案脚本，释放创意生产力",
    icon: "🎨",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "enterprise",
    name: "企业应用",
    description: "团队选型、合规落地、降本增效，企业 AI 转型实战",
    icon: "🏢",
    color: "from-emerald-500 to-teal-600",
  },
] as const;

export type RoleId = (typeof roles)[number]["id"];

export const navItems = [
  { href: "/roles/workplace", label: "分角色导航" },
  { href: "/guides", label: "入门指南" },
  { href: "/tools", label: "工具图谱" },
  { href: "/prompts", label: "Prompt 库" },
  { href: "/learn", label: "AI 原理课" },
  { href: "/news", label: "资讯" },
  { href: "/subscribe", label: "订阅" },
];

export function getDefaultMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "AI教程",
      "人工智能",
      "ChatGPT",
      "Cursor",
      "Prompt",
      "AI工具",
      "职场效率",
      "AI编程",
    ],
    authors: [{ name: siteConfig.name }],
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
}
