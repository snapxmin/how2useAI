# 如何用好AI — 门户网站

中文场景下，帮不同角色把 AI 真正用起来。实战指南、工具评测、Prompt 库与学习路径。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **内容**: MDX + Markdown (gray-matter + next-mdx-remote)
- **样式**: Tailwind CSS + @tailwindcss/typography
- **部署**: GitHub Pages (GitHub Actions 自动部署)

## 快速开始

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
├── app/                  # Next.js 页面路由
│   ├── guides/[slug]/    # 文章详情
│   ├── roles/[role]/     # 分角色聚合页
│   ├── tools/            # 工具图谱
│   ├── prompts/          # Prompt 库
│   └── subscribe/        # 订阅页
├── components/           # React 组件
├── content/
│   ├── guides/           # MDX 文章
│   ├── tools/            # 工具数据 JSON
│   └── prompts/          # Prompt 数据 JSON
└── lib/                  # 工具函数与内容加载
```

## 添加新文章

在 `content/guides/` 下创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
description: "文章描述"
role: workplace
date: "2026-07-10"
tags: ["标签1", "标签2"]
featured: false
---

文章内容...
```

## 部署

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动执行 `next build` 静态导出并发布到 GitHub Pages。

首次使用需在仓库 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**（工作流也会尝试自动启用）。

本地验证静态导出：

```bash
npm run build   # 产物输出到 out/
```

## 许可证

MIT
