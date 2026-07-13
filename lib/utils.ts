import { roles } from "./config";

export function getRoleName(roleId: string): string {
  const role = roles.find((r) => r.id === roleId);
  return role?.name ?? roleId;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPricingLabel(pricing: string): string {
  const labels: Record<string, string> = {
    free: "免费",
    freemium: "免费增值",
    paid: "付费",
  };
  return labels[pricing] ?? pricing;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
