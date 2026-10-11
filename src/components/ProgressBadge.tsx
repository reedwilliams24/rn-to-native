"use client";

import type { ReactNode } from "react";
import { chapterStatus, useProgress } from "@/lib/progress";

export function ProgressBadge({ slug, fallback = null }: { slug: string; fallback?: ReactNode }) {
  const p = useProgress().chapters[slug];
  const { answered, quizDone, done } = chapterStatus(p);
  if (!p || (!done && answered === 0)) return fallback;

  const label = quizDone ? `✓ ${p.correct}/${p.total}` : done ? "✓" : `${answered}/${p.total}`;
  const title = quizDone
    ? `Done. Quiz score ${p.correct} of ${p.total}`
    : done
      ? "Marked as read"
      : `Quiz in progress: ${answered} of ${p.total} answered`;
  return (
    <span
      title={title}
      aria-label={title}
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tabular-nums ${
        done ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {label}
    </span>
  );
}
