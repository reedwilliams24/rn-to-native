"use client";

import Link from "next/link";
import { chapterStatus, resetAllProgress, useProgress } from "@/lib/progress";

type Item = { slug: string; number: number; title: string };

export function ProgressSummary({ chapters }: { chapters: Item[] }) {
  const progress = useProgress();
  const doneCount = chapters.filter((c) => chapterStatus(progress.chapters[c.slug]).done).length;
  const started = Object.keys(progress.chapters).length > 0;
  const next = chapters.find((c) => !chapterStatus(progress.chapters[c.slug]).done);
  const target = started ? next : chapters[0];

  return (
    <div className="mt-6">
      {target ? (
        <Link
          href={`/chapters/${target.slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          {started ? `Continue with Chapter ${target.number}: ${target.title}` : "Start with Chapter 1"} →
        </Link>
      ) : null}
      {started ? (
        <div className="mt-6 max-w-md">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-zinc-900">
              {doneCount} of {chapters.length} chapters done
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear all quiz answers and progress on this device?")) resetAllProgress();
              }}
              className="text-xs text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline"
            >
              Reset progress
            </button>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={chapters.length}
            aria-valuenow={doneCount}
            aria-label="Chapters done"
          >
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(doneCount / chapters.length) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-zinc-500">Progress is saved in this browser only.</p>
        </div>
      ) : null}
    </div>
  );
}
