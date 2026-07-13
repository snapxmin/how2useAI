export type GuideScene =
  | "email"
  | "meeting"
  | "document"
  | "task-planning"
  | "data-analysis"
  | "information"
  | "communication"
  | "coding"
  | "code-review"
  | "rag"
  | "image"
  | "video"
  | "landing"
  | "selection"
  | "getting-started"
  | "prompt";

export interface SceneConfig {
  label: string;
  icon: string;
  badgeClass: string;
  accentClass: string;
  headerClass: string;
}

export const sceneConfig: Record<GuideScene, SceneConfig> = {
  email: {
    label: "邮件写作",
    icon: "✉️",
    badgeClass: "bg-sky-100 text-sky-800 ring-sky-200",
    accentClass: "border-l-sky-500",
    headerClass: "bg-sky-50",
  },
  meeting: {
    label: "会议纪要",
    icon: "📝",
    badgeClass: "bg-violet-100 text-violet-800 ring-violet-200",
    accentClass: "border-l-violet-500",
    headerClass: "bg-violet-50",
  },
  document: {
    label: "文档协作",
    icon: "📄",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    accentClass: "border-l-amber-500",
    headerClass: "bg-amber-50",
  },
  "task-planning": {
    label: "任务规划",
    icon: "✅",
    badgeClass: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    accentClass: "border-l-emerald-500",
    headerClass: "bg-emerald-50",
  },
  "data-analysis": {
    label: "数据分析",
    icon: "📊",
    badgeClass: "bg-cyan-100 text-cyan-800 ring-cyan-200",
    accentClass: "border-l-cyan-500",
    headerClass: "bg-cyan-50",
  },
  information: {
    label: "信息整理",
    icon: "📚",
    badgeClass: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    accentClass: "border-l-indigo-500",
    headerClass: "bg-indigo-50",
  },
  communication: {
    label: "沟通表达",
    icon: "💬",
    badgeClass: "bg-rose-100 text-rose-800 ring-rose-200",
    accentClass: "border-l-rose-500",
    headerClass: "bg-rose-50",
  },
  coding: {
    label: "AI 编程",
    icon: "💻",
    badgeClass: "bg-blue-100 text-blue-800 ring-blue-200",
    accentClass: "border-l-blue-500",
    headerClass: "bg-blue-50",
  },
  "code-review": {
    label: "代码审查",
    icon: "🔍",
    badgeClass: "bg-teal-100 text-teal-800 ring-teal-200",
    accentClass: "border-l-teal-500",
    headerClass: "bg-teal-50",
  },
  rag: {
    label: "AI 工程",
    icon: "🧠",
    badgeClass: "bg-purple-100 text-purple-800 ring-purple-200",
    accentClass: "border-l-purple-500",
    headerClass: "bg-purple-50",
  },
  image: {
    label: "图片创作",
    icon: "🎨",
    badgeClass: "bg-pink-100 text-pink-800 ring-pink-200",
    accentClass: "border-l-pink-500",
    headerClass: "bg-pink-50",
  },
  video: {
    label: "视频创作",
    icon: "🎬",
    badgeClass: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
    accentClass: "border-l-fuchsia-500",
    headerClass: "bg-fuchsia-50",
  },
  landing: {
    label: "企业落地",
    icon: "🏢",
    badgeClass: "bg-slate-100 text-slate-800 ring-slate-200",
    accentClass: "border-l-slate-500",
    headerClass: "bg-slate-50",
  },
  selection: {
    label: "工具选型",
    icon: "⚖️",
    badgeClass: "bg-orange-100 text-orange-800 ring-orange-200",
    accentClass: "border-l-orange-500",
    headerClass: "bg-orange-50",
  },
  "getting-started": {
    label: "入门指南",
    icon: "🚀",
    badgeClass: "bg-brand-100 text-brand-800 ring-brand-200",
    accentClass: "border-l-brand-500",
    headerClass: "bg-brand-50",
  },
  prompt: {
    label: "Prompt 技巧",
    icon: "✨",
    badgeClass: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    accentClass: "border-l-yellow-500",
    headerClass: "bg-yellow-50",
  },
};

export function getSceneConfig(scene?: GuideScene): SceneConfig {
  if (scene && scene in sceneConfig) {
    return sceneConfig[scene];
  }
  return sceneConfig["getting-started"];
}
