import type { Platform } from "@/content/types";

export const PLATFORM_STYLE: Record<Platform, { dot: string; text: string; border: string }> = {
  rn: { dot: "bg-sky-400", text: "text-sky-700", border: "border-sky-200" },
  android: { dot: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200" },
  ios: { dot: "bg-orange-500", text: "text-orange-700", border: "border-orange-200" },
};
