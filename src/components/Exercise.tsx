"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { PLATFORMS, type ExercisePlatform, type Platform } from "@/content/types";
import type { Cloze, ExerciseData } from "@/lib/cloze";
import { Inline } from "@/lib/inline";
import { exerciseProgress, recordExerciseSolved, useProgress } from "@/lib/progress";
import { PLATFORM_STYLE } from "./platform";

type Tab = ExercisePlatform | "both";
const TABS: { id: Tab; label: string }[] = [
  { id: "android", label: "Kotlin" },
  { id: "ios", label: "Swift" },
  { id: "both", label: "Both" },
];

type PaneState = {
  values: (string | null)[];
  /** null until graded; reset when that blank is changed */
  results: (boolean | null)[];
  hints: boolean[];
  solution: boolean;
  /** The blank whose word bank is open */
  active: number | null;
};

function initial(cloze: Cloze): PaneState {
  const n = cloze.answers.length;
  return { values: Array(n).fill(null), results: Array(n).fill(null), hints: Array(n).fill(false), solution: false, active: 0 };
}

export function Exercise({ slug, data }: { slug: string; data: ExerciseData }) {
  const base = useId();
  const [tab, setTab] = useState<Tab>("android");
  const [panes, setPanes] = useState<Record<ExercisePlatform, PaneState>>(() => ({
    android: initial(data.platforms.android),
    ios: initial(data.platforms.ios),
  }));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progress = exerciseProgress(useProgress().chapters[slug], data.id);
  const shown: ExercisePlatform[] = tab === "both" ? ["android", "ios"] : [tab];

  function patch(p: ExercisePlatform, fn: (s: PaneState) => PaneState) {
    setPanes((prev) => ({ ...prev, [p]: fn(prev[p]) }));
  }

  function onTabKey(e: KeyboardEvent, i: number) {
    const last = TABS.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <article aria-labelledby={`${base}-title`} className="rounded-xl border border-zinc-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={`${base}-title`} className="text-lg font-semibold text-zinc-900">
          {data.title}
        </h3>
        {progress.completed ? (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">✓ Completed</span>
        ) : null}
      </div>
      <p className="mt-1 max-w-3xl text-zinc-600">
        <Inline text={data.prompt} />
      </p>

      <div role="tablist" aria-label={`Language for ${data.title}`} className="mt-4 inline-flex gap-1 rounded-lg bg-zinc-100 p-1">
        {TABS.map((t, i) => {
          const selected = tab === t.id;
          const solved = t.id !== "both" && progress.platforms.includes(t.id);
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`rounded-md px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-sky-500 ${
                selected ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {t.label}
              {solved ? (
                <span className="ml-1 text-emerald-700">
                  ✓<span className="sr-only"> solved</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${tab}`}
        className="mt-4 flex flex-col gap-4 xl:flex-row"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <PaneHeader platform="rn" />
          <div
            className="code overflow-x-auto rounded-b-lg border border-zinc-800 bg-[#0d1117] text-[12.5px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.rnHtml }}
          />
        </div>
        {shown.map((p) => (
          <ClozePane
            key={p}
            id={`${base}-${p}`}
            platform={p}
            cloze={data.platforms[p]}
            state={panes[p]}
            solved={progress.platforms.includes(p)}
            patch={(fn) => patch(p, fn)}
            onSolved={() => recordExerciseSolved(slug, data.id, p)}
          />
        ))}
      </div>
    </article>
  );
}

function PaneHeader({ platform, solved }: { platform: Platform; solved?: boolean }) {
  const meta = PLATFORMS.find((p) => p.id === platform)!;
  return (
    <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-900 px-3 py-2">
      <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[platform].dot}`} />
      <span className="shrink-0 text-sm font-medium text-zinc-100">{meta.label}</span>
      <span className="min-w-0 truncate text-xs text-zinc-400">{meta.sub}</span>
      {solved ? <span className="ml-auto shrink-0 whitespace-nowrap text-xs font-medium text-emerald-300">✓ Solved</span> : null}
    </div>
  );
}

function ClozePane({
  id,
  platform,
  cloze,
  state,
  solved,
  patch,
  onSolved,
}: {
  id: string;
  platform: ExercisePlatform;
  cloze: Cloze;
  state: PaneState;
  solved: boolean;
  patch: (fn: (s: PaneState) => PaneState) => void;
  onSolved: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const n = cloze.answers.length;
  const graded = state.results.filter((r) => r !== null).length;
  const correct = state.results.filter((r) => r === true).length;
  const filled = state.values.filter((v) => v !== null).length;
  const label = PLATFORMS.find((p) => p.id === platform)!.label;
  const active = state.active;

  useEffect(() => {
    if (!pendingFocus.current) return;
    root.current?.querySelector<HTMLElement>(`[data-focus="${pendingFocus.current}"]`)?.focus();
    pendingFocus.current = null;
  });

  function open(i: number | null, focus?: string) {
    patch((s) => ({ ...s, active: i }));
    if (focus) pendingFocus.current = focus;
  }

  function pick(i: number, option: string) {
    const values = state.values.map((v, j) => (j === i ? option : v));
    const next = [...values.keys()].map((k) => (i + 1 + k) % n).find((j) => values[j] === null);
    patch((s) => ({
      ...s,
      values,
      results: s.results.map((r, j) => (j === i ? null : r)),
      active: next ?? null,
    }));
    pendingFocus.current = next === undefined ? "check" : `chip-0`;
  }

  function check() {
    const results = state.values.map((v, i) => v === cloze.answers[i]);
    const firstWrong = results.indexOf(false);
    patch((s) => ({ ...s, results, active: firstWrong === -1 ? null : firstWrong }));
    if (firstWrong === -1) onSolved();
    else pendingFocus.current = `blank-${firstWrong}`;
  }

  const status =
    graded === 0
      ? `${filled} of ${n} blanks filled.`
      : correct === n
        ? `✓ All ${n} blanks correct. Solved!`
        : `✗ ${correct} of ${n} correct. Change the blanks marked ✗ and check again.`;

  return (
    <div ref={root} className="flex min-w-0 flex-1 flex-col" role="group" aria-label={`${label} exercise`}>
      <PaneHeader platform={platform} solved={solved} />
      <div className="code overflow-x-auto rounded-b-lg border border-zinc-800 bg-[#0d1117] text-[12.5px] leading-relaxed">
        <pre className="shiki" style={{ color: "#e6edf3" }}>
          <code>
            {cloze.lines.map((line, li) => (
              <span key={li}>
                {li > 0 ? "\n" : null}
                <span className="line">
                  {line.map((seg, si) =>
                    "blank" in seg ? (
                      <BlankSlot
                        key={si}
                        index={seg.blank}
                        total={n}
                        describedBy={`${id}-b${seg.blank}`}
                        controls={`${id}-bank`}
                        value={state.values[seg.blank]}
                        result={state.results[seg.blank]}
                        active={active === seg.blank}
                        onOpen={() => open(seg.blank, "chip-0")}
                      />
                    ) : (
                      <span key={si} style={seg.color ? { color: seg.color } : undefined}>
                        {seg.text}
                      </span>
                    ),
                  )}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>

      <div id={`${id}-bank`} className="mt-3">
        {active !== null ? (
          <div
            role="group"
            aria-label={`Options for blank ${active + 1}`}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                open(null, `blank-${active}`);
              }
            }}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
          >
            <div className="mb-2 text-xs font-medium text-zinc-500">
              Blank {active + 1}: pick one
            </div>
            <div className="flex flex-wrap gap-2">
              {cloze.options[active].map((opt, oi) => {
                const chosen = state.values[active] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    data-focus={`chip-${oi}`}
                    aria-pressed={chosen}
                    onClick={() => pick(active, opt)}
                    className={`rounded-md border px-2.5 py-1.5 font-mono text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                      chosen ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Tap a blank to choose what goes there.</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-focus="check"
          onClick={check}
          disabled={filled < n}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Check
        </button>
        <button
          type="button"
          aria-expanded={state.solution}
          aria-controls={`${id}-solution`}
          onClick={() => patch((s) => ({ ...s, solution: !s.solution }))}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        >
          {state.solution ? "Hide solution" : "Show solution"}
        </button>
        <button
          type="button"
          onClick={() => {
            patch(() => initial(cloze));
            pendingFocus.current = "blank-0";
          }}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        >
          Clear
        </button>
      </div>
      <p role="status" className={`mt-2 text-sm ${graded && correct === n ? "font-medium text-emerald-700" : graded ? "text-rose-700" : "text-zinc-600"}`}>
        {status}
      </p>

      <ol className="mt-3 space-y-1.5 text-sm">
        {cloze.hints.map((hint, i) => {
          const r = state.results[i];
          return (
            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium text-zinc-800">Blank {i + 1}</span>
              <span
                id={`${id}-b${i}`}
                className={r === true ? "text-emerald-700" : r === false ? "text-rose-700" : "text-zinc-400"}
              >
                {r === true ? "✓ Correct" : r === false ? "✗ Not quite" : "Not checked"}
                {state.hints[i] ? <span className="sr-only">. Hint: {hint}</span> : null}
              </span>
              <button
                type="button"
                aria-expanded={state.hints[i]}
                aria-controls={`${id}-h${i}`}
                onClick={() => patch((s) => ({ ...s, hints: s.hints.map((h, j) => (j === i ? !h : h)) }))}
                className="rounded px-1.5 text-xs text-sky-700 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-sky-500"
              >
                {state.hints[i] ? "Hide hint" : "Hint"}
              </button>
              <span id={`${id}-h${i}`} className="basis-full text-zinc-600" hidden={!state.hints[i]}>
                <Inline text={hint} />
              </span>
            </li>
          );
        })}
      </ol>

      <div id={`${id}-solution`} hidden={!state.solution} className="mt-4">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">Model answer</div>
        <div
          className="code overflow-x-auto rounded-lg border border-zinc-800 bg-[#0d1117] text-[12.5px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cloze.solutionHtml }}
        />
      </div>
    </div>
  );
}

function BlankSlot({
  index,
  total,
  describedBy,
  controls,
  value,
  result,
  active,
  onOpen,
}: {
  index: number;
  total: number;
  describedBy: string;
  controls: string;
  value: string | null;
  result: boolean | null;
  active: boolean;
  onOpen: () => void;
}) {
  const tone =
    result === true
      ? "border-solid border-emerald-400 bg-emerald-950/60"
      : result === false
        ? "border-solid border-rose-400 bg-rose-950/60"
        : active
          ? "border-solid border-sky-400 bg-sky-950/60"
          : "border-dashed border-zinc-500 bg-zinc-800/80";
  return (
    <>
      <button
        type="button"
        data-focus={`blank-${index}`}
        aria-label={`Blank ${index + 1} of ${total}: ${value ?? "empty"}`}
        aria-describedby={describedBy}
        aria-expanded={active}
        aria-controls={controls}
        onClick={onOpen}
        className={`mx-px min-w-[3ch] rounded border px-[0.5ch] text-zinc-50 focus-visible:outline-2 focus-visible:outline-sky-400 ${tone}`}
      >
        {value ?? <span className="text-zinc-500">{index + 1}</span>}
      </button>
      {result !== null ? (
        <span aria-hidden className={`ml-0.5 font-sans font-bold ${result ? "text-emerald-400" : "text-rose-400"}`}>
          {result ? "✓" : "✗"}
        </span>
      ) : null}
    </>
  );
}
