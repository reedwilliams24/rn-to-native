"use client";

import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";

function lineIds(e: SyntheticEvent) {
  return (e.target as Element).closest<HTMLElement>("[data-link]")?.dataset.link ?? null;
}

/** Highlights every line sharing a `data-link` id with the hovered, focused, or pinned (tapped) line. */
export function LinkedLines({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = pinned ?? hovered ?? focused;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ids = active?.split(" ") ?? [];
    root.querySelectorAll<HTMLElement>("[data-link]").forEach((el) => {
      const on = el.dataset.link!.split(" ").some((id) => ids.includes(id));
      el.classList.toggle("link-active", on);
    });
    root.classList.toggle("link-pinned", pinned !== null);
  }, [active, pinned]);

  useEffect(() => {
    if (pinned === null) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPinned(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [pinned]);

  const togglePin = (ids: string | null) => setPinned((prev) => (ids === null || prev === ids ? null : ids));

  return (
    <div
      ref={ref}
      className="linkable"
      onPointerOver={(e) => e.pointerType === "mouse" && setHovered(lineIds(e))}
      onPointerLeave={() => setHovered(null)}
      onFocus={(e) => setFocused(lineIds(e))}
      onBlur={() => setFocused(null)}
      onClick={(e) => togglePin(lineIds(e))}
      onKeyDown={(e) => {
        if (e.key === "Escape") setPinned(null);
        else if ((e.key === "Enter" || e.key === " ") && lineIds(e)) {
          e.preventDefault();
          togglePin(lineIds(e));
        }
      }}
    >
      {children}
    </div>
  );
}
