# 每日开发者实战指南 — Cursor Automation 配置

每晚 **17:00（北京时间）** 自动生成 3 篇开发编程实战指南，覆盖从 7 天入门到 30 天 AI 工程化的完整学习路径。

## 学习路径概览

| 阶段 | 天数 | 目标 | 核心工具 |
|------|------|------|----------|
| 7 天入门 | Day 1-7 | Cursor、Copilot 基础，Agent 初体验 | Cursor, Copilot |
| 14 天进阶 | Day 8-14 | Claude Code、Codex、多 Agent 协作 | Claude Code, Codex, Cursor |
| 30 天工程化 | Day 15-30 | RAG、MCP、CI/CD、生产部署 | 全栈 AI 工程 |

完整课程大纲见 `content/guides/developer-curriculum.json`（共 90 篇，每天 3 篇）。

## 方式一：Cursor Automation（推荐）

在 [cursor.com/automations](https://cursor.com/automations) 创建自动化：

### 触发器

- **类型**：Scheduled（定时）
- **Cron 表达式**：`CRON_TZ=Asia/Shanghai 0 17 * * *`
- **说明**：每天 17:00 北京时间

### 仓库

- **Repository**：`snapxmin/how2useAI`
- **Branch**：`main`

### 工具

- ✅ Pull request creation（自动创建 PR）
- ✅ Memories（记住已发布进度，可选）

### Prompt

将以下命令的输出作为每日 Prompt 模板的基础（或直接引用课程文件）：

```bash
node scripts/get-next-developer-guides.mjs --prompt
```

**固定 Prompt 模板**（Automation 中填写）：

```
你是「如何用好AI」门户的开发者内容编辑。请执行每日开发者指南生成任务。

## 第一步：获取今日任务

运行 `node scripts/get-next-developer-guides.mjs --prompt`，按输出的 3 篇文章要求撰写 MDX。

## 第二步：撰写文章

- 在 content/guides/ 下创建 {slug}.mdx
- role: developer
- 每篇 800-1500 字，含实操步骤与最佳实践
- 覆盖 Cursor、Codex、Claude Code 等工具的真实场景
- 参考 content/guides/cursor-beginner-guide.mdx 的风格

## 第三步：更新进度

- 将 content/guides/developer-curriculum.json 中对应文章 status 改为 published
- 运行 npm test 确保通过
- 提交并创建 PR
```

## 方式二：GitHub Actions + Cursor API

工作流文件：`.github/workflows/daily-developer-guides.yml`

### 配置步骤

1. 在 Cursor Dashboard → API Keys 生成 API Key
2. 在 GitHub 仓库 Settings → Secrets → Actions 添加 `CURSOR_API_KEY`
3. 工作流将在每天 09:00 UTC（17:00 CST）自动触发 Cloud Agent

### 手动触发

```bash
# 查看今日待生成文章
node scripts/get-next-developer-guides.mjs

# 输出完整 Automation Prompt
node scripts/get-next-developer-guides.mjs --prompt

# 手动触发 API（需 CURSOR_API_KEY）
node scripts/trigger-daily-developer-guides.mjs
```

也可在 GitHub Actions 页面手动运行 **Daily Developer Guides** 工作流。

## 课程进度查询

```bash
# 查看下一批待生成文章
node scripts/get-next-developer-guides.mjs

# JSON 格式
node scripts/get-next-developer-guides.mjs --json

# 指定阶段
node scripts/get-next-developer-guides.mjs --phase 7d --count 3
```

## 文件结构

```
content/
├── paths/developer.json          # 学习路径元数据
└── guides/
    ├── developer-curriculum.json   # 90 篇课程大纲与发布状态
    └── *.mdx                       # 已发布的实战指南

scripts/
├── get-next-developer-guides.mjs   # 获取今日任务 / 生成 Prompt
└── trigger-daily-developer-guides.mjs  # API 触发脚本

.github/workflows/
└── daily-developer-guides.yml      # GitHub Actions 定时任务
```

## 注意事项

- Automation cron 默认使用 UTC，务必加 `CRON_TZ=Asia/Shanghai` 前缀
- 每次运行生成 3 篇文章，约 30 天完成全部 90 篇
- 已发布文章（如 cursor-beginner-guide）已在课程大纲中标记为 published
- Cloud Agent 运行按 API 定价计费，建议开启 autoCreatePR 便于人工审核
