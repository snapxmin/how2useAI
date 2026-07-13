import type { GuideScene } from "@/lib/scenes";
import { getSceneConfig } from "@/lib/scenes";
import { cn } from "@/lib/utils";

interface SceneBadgeProps {
  scene?: GuideScene;
  size?: "sm" | "md";
  className?: string;
}

export function SceneBadge({ scene, size = "md", className }: SceneBadgeProps) {
  const config = getSceneConfig(scene);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold ring-1 ring-inset",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        config.badgeClass,
        className
      )}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
