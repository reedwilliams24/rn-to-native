"use client";

import { chapterStatus, setRead, useProgress } from "@/lib/progress";

export function MarkRead({ slug }: { slug: string }) {
  const p = useProgress().chapters[slug];
  const { quizDone } = chapterStatus(p);
  const read = Boolean(p?.read);

  if (quizDone && !read) {
    return <p className="text-sm font-medium text-emerald-700">✓ Chapter done</p>;
  }
  return (
    <button
      type="button"
      onClick={() => setRead(slug, !read)}
      aria-pressed={read}
      className={`rounded-md border px-3 py-1.5 text-sm ${
        read ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      {read ? "✓ Marked as read (undo)" : "Mark chapter as read"}
    </button>
  );
}
