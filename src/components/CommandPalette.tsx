"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { entryHref, search, type SearchEntry, type SearchIndex } from "@/lib/search";
import { Inline } from "@/lib/inline";
import { PLATFORM_STYLE } from "./platform";

const OPEN_EVENT = "rn2native:open-search";
const EXAMPLES = ["useEffect", "FlatList", "AsyncStorage", "navigation.push"];

let indexPromise: Promise<SearchEntry[]> | undefined;

function loadIndex(url: string) {
  indexPromise ??= fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<SearchIndex>;
    })
    .then((i) => i.entries)
    .catch((err) => {
      indexPromise = undefined;
      throw err;
    });
  return indexPromise;
}

/** Scrolls to and briefly highlights `anchor` once the chapter page for `slug` has rendered. */
function reveal(slug: string, anchor: string) {
  const deadline = performance.now() + 4000;
  const tick = () => {
    const el = window.location.pathname.includes(`/chapters/${slug}/`) ? document.getElementById(anchor) : null;
    if (!el) {
      if (performance.now() < deadline) requestAnimationFrame(tick);
      return;
    }
    el.scrollIntoView({ block: el.tagName === "TR" ? "center" : "start" });
    const target = el.tagName === "SECTION" ? (el.querySelector("h2") ?? el) : el;
    target.removeAttribute("data-search-hit");
    void (target as HTMLElement).offsetWidth;
    target.setAttribute("data-search-hit", "");
    window.setTimeout(() => target.removeAttribute("data-search-hit"), 2000);
  };
  requestAnimationFrame(tick);
}

const subscribeNoop = () => () => {};

export function SearchButton() {
  const shortcut = useSyncExternalStore(
    subscribeNoop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"),
    () => "Ctrl K",
  );
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-500 shadow-sm hover:border-zinc-400 hover:text-zinc-900"
      aria-label="Search concepts"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 4 4" strokeLinecap="round" />
      </svg>
      <span>I know X in RN…</span>
      <kbd className="hidden rounded border border-zinc-200 bg-zinc-50 px-1.5 font-sans text-[11px] text-zinc-500 sm:inline">{shortcut}</kbd>
    </button>
  );
}

export function CommandPalette({ indexUrl }: { indexUrl: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  return open ? <Palette indexUrl={indexUrl} onClose={() => setOpen(false)} /> : null;
}

function Palette({ indexUrl, onClose }: { indexUrl: string; onClose: () => void }) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const pointer = useRef({ x: -1, y: -1 });

  useEffect(() => {
    let live = true;
    loadIndex(indexUrl).then(
      (e) => live && setEntries(e),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, [indexUrl]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  const results = useMemo(() => (entries ? search(entries, query) : []), [entries, query]);
  const optionId = (i: number) => `${listId}-${i}`;

  useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const choose = useCallback(
    (e: SearchEntry) => {
      onClose();
      router.push(entryHref(e), { scroll: false });
      reveal(e.slug, e.anchor);
    },
    [onClose, router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      choose(results[active]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-3 pt-[8vh] backdrop-blur-[2px] sm:px-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Look up a React Native concept"
        className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden>
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="I know… useEffect, FlatList, AsyncStorage"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? optionId(active) : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-zinc-200 px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline">Esc</kbd>
          <button type="button" onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-900 sm:hidden">
            Close
          </button>
        </div>

        <div id={listId} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto p-2">
          {failed ? (
            <p className="px-3 py-6 text-sm text-zinc-500">Couldn&apos;t load the search index.</p>
          ) : !entries ? (
            <p className="px-3 py-6 text-sm text-zinc-500">Loading…</p>
          ) : query.trim() === "" ? (
            <div className="px-3 py-4 text-sm text-zinc-500">
              Type a React Native API to see its Kotlin and Swift equivalents. Try:
              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setQuery(ex);
                      setActive(0);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-zinc-200 px-2.5 py-1 font-mono text-xs text-zinc-700 hover:border-zinc-400"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-sm text-zinc-500">No matches for &ldquo;{query}&rdquo;.</p>
          ) : (
            results.map((r, i) => (
              <Link
                key={`${r.slug}-${r.kind}-${i}`}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                href={entryHref(r)}
                scroll={false}
                onMouseMove={(e) => {
                  // Chrome fires mousemove when the list scrolls under a still cursor; only real moves count.
                  const { x, y } = pointer.current;
                  if (e.clientX === x && e.clientY === y) return;
                  pointer.current = { x: e.clientX, y: e.clientY };
                  if (x !== -1 && i !== active) setActive(i);
                }}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  onClose();
                  reveal(r.slug, r.anchor);
                }}
                className={`block rounded-lg px-3 py-2.5 ${i === active ? "bg-zinc-100" : ""}`}
              >
                <Result entry={r} />
              </Link>
            ))
          )}
        </div>

        <div className="hidden gap-4 border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] text-zinc-500 sm:flex">
          <span>↑↓ to navigate</span>
          <span>↵ to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}

function Result({ entry }: { entry: SearchEntry }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0 text-sm font-medium text-zinc-900">
          {entry.kind === "section" ? (
            <span className="mr-2 rounded bg-zinc-200/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">Section</span>
          ) : (
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${PLATFORM_STYLE.rn.dot}`} aria-hidden />
          )}
          <Inline text={entry.rn} />
        </div>
        <div className="shrink-0 text-right text-xs text-zinc-500">
          <span className="tabular-nums">{entry.number}.</span> {entry.chapterTitle}
        </div>
      </div>
      {entry.kind === "cheatsheet" ? (
        <div className="mt-1.5 grid gap-x-4 gap-y-1 text-[13px] text-zinc-700 sm:grid-cols-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className={`w-11 shrink-0 text-[11px] font-semibold leading-5 ${PLATFORM_STYLE.android.text}`}>Kotlin</span>
            <span className="min-w-0 break-words">
              <Inline text={entry.android} />
            </span>
          </div>
          <div className="flex min-w-0 items-baseline gap-2">
            <span className={`w-11 shrink-0 text-[11px] font-semibold leading-5 ${PLATFORM_STYLE.ios.text}`}>Swift</span>
            <span className="min-w-0 break-words">
              <Inline text={entry.ios} />
            </span>
          </div>
        </div>
      ) : null}
      {entry.kind === "cheatsheet" ? (
        <div className="mt-1 truncate text-xs text-zinc-400">
          → <Inline text={entry.where} />
        </div>
      ) : null}
    </>
  );
}
