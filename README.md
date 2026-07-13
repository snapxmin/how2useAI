# 如何用好AI — 门户网站

中文场景下，帮不同角色把 AI 真正用起来。实战指南、工具评测、Prompt 库与学习路径。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **内容**: MDX + Markdown (gray-matter + next-mdx-remote)
- **样式**: Tailwind CSS + @tailwindcss/typography
- **部署**: Vercel / GitHub Pages

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

### Vercel

```bash
npm run build
```

推送到 GitHub 后，在 Vercel 导入项目即可自动部署。

### GitHub Pages

项目已配置 GitHub Actions 工作流（`.github/workflows/deploy-pages.yml`），推送到 `main` 分支后会自动构建并部署到 GitHub Pages。

**首次启用步骤：**

1. 打开仓库 **Settings → Pages**
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**
3. 将更改合并到 `main` 分支，等待工作流完成

部署地址：`https://snapxmin.github.io/how2useAI/`

本地预览 GitHub Pages 构建：

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://snapxmin.github.io/how2useAI NEXT_PUBLIC_STATIC_EXPORT=true npm run build:pages
npx serve out
```

## 许可证

MIT
