"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { PLATFORMS, type PerPlatform, type Platform } from "@/content/types";
import { Inline } from "@/lib/inline";
import { PLATFORM_STYLE } from "../platform";

type Scenario = "ok" | "block" | "offmain";
type Kind = "work" | "wait" | "block" | "crash" | "compile" | "safe";
type Step = { lane: 0 | 1; code: string; kind: Kind; note: string; idle?: string };
type Track = { lanes: [string, string]; ui: string; steps: Step[] };

const STEP_NAMES = ["tap", "fetch", "parse", "update UI"];
const ROW_NAMES = ["tap", "fetch", "parse", "update"];
const STEP_MS = 1500;

const SCENARIOS: [Scenario, string][] = [
  ["ok", "Do it right"],
  ["block", "Block the main thread"],
  ["offmain", "Update UI off the main thread"],
];

const BASE: PerPlatform<Track> = {
  rn: {
    lanes: ["UI thread", "JS thread"],
    ui: "Taps & JS animations",
    steps: [
      {
        lane: 1,
        code: "onPress()",
        kind: "work",
        idle: "touch → JS",
        note: "The UI thread gets the raw touch and sends it to the JS thread, which runs your `onPress`.",
      },
      {
        lane: 1,
        code: "await fetch(url)",
        kind: "wait",
        idle: "drawing",
        note: "`await` gives the JS thread back to the event loop until the response arrives.",
      },
      {
        lane: 1,
        code: "await res.json()",
        kind: "work",
        idle: "drawing",
        note: "Parsing runs on the JS thread too. There's no second JS thread to move it to.",
      },
      {
        lane: 0,
        code: "setItems(…)\n→ mount",
        kind: "work",
        idle: "render",
        note: "React renders on the JS thread, then the renderer mounts the change on the UI thread, \"the only thread that can manipulate host views\".",
      },
    ],
  },
  android: {
    lanes: ["Main", "IO / Default"],
    ui: "UI thread",
    steps: [
      {
        lane: 0,
        code: "viewModelScope\n.launch { }",
        kind: "work",
        note: "Click handlers run on the main thread, and `viewModelScope.launch` starts on `Dispatchers.Main`.",
      },
      {
        lane: 1,
        code: "withContext(\n  IO\n) { get() }",
        kind: "work",
        idle: "free",
        note: "`Dispatchers.IO` is for disk and network I/O off the main thread. The coroutine suspends, and Main keeps drawing.",
      },
      {
        lane: 1,
        code: "withContext(\n  Default\n) { parse() }",
        kind: "work",
        idle: "free",
        note: "`Dispatchers.Default` is for CPU-intensive work, such as sorting a list or parsing JSON.",
      },
      {
        lane: 0,
        code: "_items.value\n= list",
        kind: "work",
        note: "`withContext` returns its result and the coroutine resumes on `Dispatchers.Main`, the place for UI updates.",
      },
    ],
  },
  ios: {
    lanes: ["Main actor", "Background pool"],
    ui: "Main thread",
    steps: [
      {
        lane: 0,
        code: "Task { await\nload() }",
        kind: "work",
        note: "A SwiftUI `View` is `@MainActor`, and the `Task` inherits that actor.",
      },
      {
        lane: 1,
        code: "await session\n.data(from:)",
        kind: "work",
        idle: "free",
        note: "`await` is a possible suspension point. While `load()` waits, Swift runs other code on the main thread.",
      },
      {
        lane: 1,
        code: "@concurrent\ndecode()",
        kind: "work",
        idle: "free",
        note: "Since Swift 6.2, `@concurrent` runs a `nonisolated` async function on the background pool. Without it, the function runs on the caller's actor.",
      },
      {
        lane: 0,
        code: "items = decoded",
        kind: "work",
        note: "`load()` is `@MainActor`, so the assignment after the `await` runs on the main thread.",
      },
    ],
  },
};

const OVERRIDES: Record<Exclude<Scenario, "ok">, PerPlatform<{ index: number; step: Step }>> = {
  block: {
    rn: {
      index: 2,
      step: {
        lane: 1,
        code: "JSON.parse(\n  huge)",
        kind: "block",
        idle: "scrolls",
        note: "A big payload keeps the JS thread busy for many frames. A `TouchableOpacity` stops responding, but a `ScrollView` still scrolls because it lives on the main thread.",
      },
    },
    android: {
      index: 2,
      step: {
        lane: 0,
        code: "parse(json)\n// on Main",
        kind: "block",
        idle: "idle",
        note: "Without `withContext`, the parse runs on Main: no input, no drawing. Input that isn't handled within 5 seconds triggers an ANR.",
      },
    },
    ios: {
      index: 2,
      step: {
        lane: 0,
        code: "decode()\n// sync, on main",
        kind: "block",
        idle: "idle",
        note: "Synchronous work on the main actor blocks the main thread. Apple: \"A hang is almost always the result of long-running work on the main thread.\"",
      },
    },
  },
  offmain: {
    rn: {
      index: 3,
      step: {
        lane: 0,
        code: "setItems(…)\n→ mount",
        kind: "safe",
        idle: "render",
        note: "Can't happen from JS. Your code only runs on the JS thread and never touches host views. The renderer mounts on the UI thread for you.",
      },
    },
    android: {
      index: 3,
      step: {
        lane: 1,
        code: "statusView\n.text = …\n// in IO",
        kind: "crash",
        idle: "idle",
        note: "Views are single-threaded: \"You must always be on the UI thread when calling any method on any view.\" From a worker thread it crashes with `CalledFromWrongThreadException`.",
      },
    },
    ios: {
      index: 3,
      step: {
        lane: 1,
        code: "self.items = …\n// @concurrent",
        kind: "compile",
        idle: "idle",
        note: "`items` is main-actor-isolated, so the Swift 6 language mode rejects this at compile time. In older code, Xcode's Main Thread Checker flags UI calls made off the main thread.",
      },
    },
  },
};

function track(platform: Platform, scenario: Scenario): Track {
  const base = BASE[platform];
  if (scenario === "ok") return base;
  const { index, step } = OVERRIDES[scenario][platform];
  return { ...base, steps: base.steps.map((s, i) => (i === index ? step : s)) };
}

type Status = { label: string; tone: "idle" | "ok" | "frozen" | "error" };

function status(t: Track, platform: Platform, current: number): Status {
  if (current < 0) return { label: "Waiting for a tap", tone: "idle" };
  const kind = t.steps[current]!.kind;
  if (kind === "block") return { label: platform === "rn" ? "JS thread blocked" : "UI frozen", tone: "frozen" };
  if (kind === "crash") return { label: "Crash", tone: "error" };
  if (kind === "compile") return { label: "Won't compile", tone: "error" };
  if (current === t.steps.length - 1) return { label: "UI updated", tone: "ok" };
  return { label: "Responsive", tone: "ok" };
}

const STATUS_TONE: Record<Status["tone"], string> = {
  idle: "border-zinc-200 bg-zinc-50 text-zinc-600",
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  frozen: "border-amber-300 bg-amber-50 text-amber-900",
  error: "border-rose-300 bg-rose-50 text-rose-800",
};

const CHIP_TONE: Record<Kind, string> = {
  work: "border-sky-300 bg-sky-50 text-sky-950",
  wait: "border-dashed border-sky-300 bg-white text-sky-950",
  block: "border-amber-400 bg-amber-100 text-amber-950 thr-busy",
  crash: "border-rose-500 bg-rose-100 text-rose-950",
  compile: "border-rose-500 bg-rose-100 text-rose-950",
  safe: "border-emerald-400 bg-emerald-50 text-emerald-950",
};

const BADGE: Partial<Record<Kind, string>> = {
  wait: "waiting",
  block: "busy",
  crash: "crash",
  compile: "compile error",
  safe: "safe",
};

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

export function ThreadingTimeline() {
  const reduced = useReducedMotion();
  const [scenario, setScenario] = useState<Scenario>("ok");
  const [current, setCurrent] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const last = STEP_NAMES.length - 1;

  useEffect(() => {
    if (!playing || reduced) return;
    if (current >= last) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setCurrent((c) => c + 1), current < 0 ? 500 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, reduced, current, last]);

  function pick(s: Scenario) {
    setScenario(s);
    setCurrent(-1);
    setPlaying(false);
  }

  function play() {
    setCurrent(-1);
    setPlaying(true);
  }

  function step() {
    setPlaying(false);
    setCurrent((c) => (c >= last ? -1 : c + 1));
  }

  const stepLabel = current < 0 ? "Before the tap" : `Step ${current + 1} of ${STEP_NAMES.length}: ${STEP_NAMES[current]}`;

  return (
    <figure className="max-w-5xl overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <style>{THREAD_CSS}</style>
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Interactive</span>
        {SCENARIOS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={scenario === id}
            onClick={() => pick(id)}
            className={`rounded-full border px-3 py-1 text-sm ${
              scenario === id ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {reduced ? null : (
            <button
              type="button"
              onClick={play}
              disabled={playing}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm hover:border-zinc-500 disabled:opacity-50"
            >
              {playing ? "Playing…" : current >= 0 ? "Replay" : "Play"}
            </button>
          )}
          <button
            type="button"
            onClick={step}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm hover:border-zinc-500"
          >
            {current >= last ? "Start over" : "Next step →"}
          </button>
          <span aria-live="polite" className="text-sm font-medium text-zinc-900">
            {stepLabel}
          </span>
        </div>
        <ol className="mt-3 flex flex-wrap gap-1.5 text-xs" aria-hidden="true">
          {STEP_NAMES.map((name, i) => (
            <li
              key={name}
              className={`rounded-full px-2 py-0.5 ${
                i === current ? "bg-zinc-900 text-white" : i < current ? "bg-zinc-200 text-zinc-800" : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {i + 1}. {name}
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-col gap-5 md:flex-row">
          {PLATFORMS.map((p) => (
            <PlatformTrack key={p.id} platform={p.id} label={p.label} t={track(p.id, scenario)} current={current} />
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          A model of each platform&apos;s documented threading rules, not a profiler. Step lengths aren&apos;t to scale.
        </p>
      </div>
    </figure>
  );
}

function PlatformTrack({ platform, label, t, current }: { platform: Platform; label: string; t: Track; current: number }) {
  const s = status(t, platform, current);
  const note = current >= 0 ? t.steps[current]!.note : null;
  return (
    <div data-platform={platform} className="min-w-0 md:flex-1">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
          <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[platform].dot}`} />
          {label}
        </div>
        <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${STATUS_TONE[s.tone]}`}>
          {s.tone === "error" ? (
            <span aria-hidden="true" className="font-bold leading-none">
              ✕
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={`thr-spin inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent ${
                s.tone === "frozen" ? "thr-paused" : ""
              }`}
            />
          )}
          <span>
            <span className="sr-only">{t.ui}: </span>
            {s.label}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_minmax(0,1fr)] gap-1 text-xs">
        <div />
        {t.lanes.map((lane, i) => (
          <div key={lane} className={`truncate px-1 font-semibold ${i === 0 ? "text-zinc-900" : "text-zinc-500"}`}>
            {lane}
          </div>
        ))}
        {t.steps.map((st, i) => (
          <Row key={i} index={i} step={st} current={current} />
        ))}
      </div>
      <p className="mt-2 min-h-[4.5rem] rounded-md bg-zinc-50 px-3 py-2 text-xs leading-relaxed text-zinc-700">
        {note ? <Inline text={note} /> : "Press Play or Next step to follow one tap through the threads."}
      </p>
    </div>
  );
}

function Row({ index, step, current }: { index: number; step: Step; current: number }) {
  const state = index < current ? "done" : index === current ? "active" : "todo";
  return (
    <>
      <div className={`flex items-center px-1 ${state === "todo" ? "text-zinc-400" : "text-zinc-700"}`}>
        {index + 1}. {ROW_NAMES[index]}
      </div>
      {[0, 1].map((lane) =>
        lane === step.lane ? (
          <div
            key={lane}
            className={`relative min-h-[2.75rem] rounded-md border px-1.5 py-1 transition-opacity ${
              state === "todo" ? "border-dashed border-zinc-200 bg-white text-zinc-400" : CHIP_TONE[step.kind]
            } ${state === "active" ? "thr-active" : ""} ${state === "done" ? "opacity-70" : ""}`}
          >
            <code className="block whitespace-pre-wrap break-words font-mono text-[11px] leading-snug">{step.code}</code>
            {state !== "todo" && BADGE[step.kind] ? (
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide">{BADGE[step.kind]}</span>
            ) : null}
          </div>
        ) : (
          <div
            key={lane}
            className={`flex min-h-[2.75rem] items-center rounded-md px-1.5 text-[11px] ${
              state === "todo" ? "text-transparent" : step.idle === "free" ? "text-emerald-700" : "text-zinc-400"
            }`}
          >
            {step.idle ?? "idle"}
          </div>
        ),
      )}
    </>
  );
}

const THREAD_CSS = `
@keyframes thr-pulse {
  0% { box-shadow: 0 0 0 0 rgb(14 165 233 / 0.55); }
  100% { box-shadow: 0 0 0 8px rgb(14 165 233 / 0); }
}
@keyframes thr-spin { to { transform: rotate(360deg); } }
@keyframes thr-busy { to { background-position: 16px 0; } }
.thr-active { animation: thr-pulse 1s ease-out infinite; }
.thr-spin { animation: thr-spin 0.9s linear infinite; }
.thr-paused { animation-play-state: paused; }
.thr-busy {
  background-image: repeating-linear-gradient(45deg, rgb(251 191 36 / 0.35) 0 4px, transparent 4px 8px);
  background-size: 16px 16px;
  animation: thr-busy 0.6s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .thr-active, .thr-spin, .thr-busy { animation: none; }
  .thr-active { outline: 2px solid rgb(14 165 233); outline-offset: 1px; }
}
`;
