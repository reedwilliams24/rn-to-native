"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PLATFORMS, type Platform } from "@/content/types";
import { PLATFORM_STYLE } from "./platform";

const STORAGE_KEY = "rn2native.hidden";

export function PlatformFilter({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState<Platform[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHidden(JSON.parse(saved) as Platform[]);
  }, []);

  function toggle(id: Platform) {
    setHidden((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      if (next.length === PLATFORMS.length) return prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className={hidden.map((p) => `hide-${p}`).join(" ")}>
      <div className="sticky top-0 z-10 -mx-6 mb-8 flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-white/90 px-6 py-3 backdrop-blur lg:-mx-10 lg:px-10">
        <span className="mr-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Show</span>
        {PLATFORMS.map((p) => {
          const on = !hidden.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${
                on ? `${PLATFORM_STYLE[p.id].border} bg-white text-zinc-900` : "border-zinc-200 bg-zinc-100 text-zinc-400 line-through"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${on ? PLATFORM_STYLE[p.id].dot : "bg-zinc-300"}`} />
              {p.label}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
