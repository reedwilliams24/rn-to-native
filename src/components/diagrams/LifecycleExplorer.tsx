"use client";

import { useState } from "react";
import { PLATFORMS, type Platform, type PerPlatform } from "@/content/types";
import { Inline } from "@/lib/inline";
import { PLATFORM_STYLE } from "../platform";

type EventId = "launch" | "background" | "foreground" | "rotate" | "kill" | "relaunch";
type Phase = "off" | "foreground" | "background" | "killed";

/** `none` rows mean "nothing fires"; `divider` rows label a new instance. */
type Row = { code: string; note?: string; kind?: "none" | "divider" };
type Group = { title: string; rows: Row[] };
type Outcome = { state: string; groups: Group[] };

const NEXT_PHASE: Record<EventId, Phase> = {
  launch: "foreground",
  background: "background",
  foreground: "foreground",
  rotate: "foreground",
  kill: "killed",
  relaunch: "foreground",
};

const BUTTONS: { id: EventId; label: string; enabled: (p: Phase) => boolean }[] = [
  { id: "launch", label: "Launch", enabled: (p) => p === "off" },
  { id: "background", label: "Home (background)", enabled: (p) => p === "foreground" },
  { id: "foreground", label: "Return", enabled: (p) => p === "background" },
  { id: "rotate", label: "Rotate", enabled: (p) => p === "foreground" },
  { id: "kill", label: "System kills process", enabled: (p) => p === "background" },
  { id: "relaunch", label: "Reopen from Recents", enabled: (p) => p === "killed" },
];

const EVENT_LABEL: Record<EventId, string> = {
  launch: "Launch",
  background: "Home",
  foreground: "Return",
  rotate: "Rotate",
  kill: "Process killed",
  relaunch: "Reopen",
};

const SUMMARY: Record<EventId, string> = {
  launch: "Cold start: every platform builds its UI and runs mount effects.",
  background: "The UI stays alive on all three. Only lifecycle and app-state callbacks fire.",
  foreground: "Same instances come back. Nothing remounts.",
  rotate: "Only Android tears the UI down: the Activity and its composition are recreated.",
  kill: "No callback anywhere. The process is simply gone.",
  relaunch: "A cold start again, plus whatever state the platform saved for you.",
};

const ANDROID_START: Row[] = [
  { code: "`onStart()`", note: "Visible." },
  { code: "`onRestoreInstanceState()`", note: "Between `onStart` and `onPostCreate`." },
  { code: "`onResume()`", note: "Interactive." },
];

const IOS_COLD: Row[] = [
  { code: "`application(_:didFinishLaunchingWithOptions:)`" },
  { code: "`scene(_:willConnectTo:options:)`" },
  { code: "`sceneDidBecomeActive(_:)`", note: "`scenePhase` is `.active`." },
];

const OUTCOMES: Record<EventId, PerPlatform<Outcome>> = {
  launch: {
    rn: {
      state: "'active'",
      groups: [
        {
          title: "AppState",
          rows: [{ code: "No `change` event", kind: "none", note: "Read `AppState.currentState` for the starting value." }],
        },
        {
          title: "Component",
          rows: [
            { code: "Component mounts", note: "`useState` takes its initial value." },
            { code: "`useEffect` runs", note: "After the first render is committed." },
          ],
        },
      ],
    },
    android: {
      state: "RESUMED",
      groups: [
        {
          title: "Activity",
          rows: [
            { code: "`onCreate(null)`", note: "First launch, so no saved state." },
            { code: "`onStart()`", note: "Visible." },
            { code: "`onResume()`", note: "Interactive." },
          ],
        },
        {
          title: "Compose",
          rows: [
            { code: "Composable enters the composition", note: "`remember` and `rememberSaveable` take initial values." },
            { code: "`LaunchedEffect` / `DisposableEffect` start" },
            { code: "`LifecycleEventEffect(ON_RESUME)`", note: "Fires on first display, not just on return." },
          ],
        },
      ],
    },
    ios: {
      state: ".active",
      groups: [
        { title: "App & scene delegate", rows: IOS_COLD },
        {
          title: "SwiftUI view",
          rows: [
            { code: "`@State` takes its initial value" },
            { code: "`.onAppear` and `.task` run", note: "Both before the view appears. Their relative order isn't documented." },
          ],
        },
      ],
    },
  },
  background: {
    rn: {
      state: "'background'",
      groups: [
        {
          title: "AppState",
          rows: [
            { code: "`change` → `'inactive'`", note: "iOS only, during the transition." },
            { code: "`change` → `'background'`" },
          ],
        },
        { title: "Component", rows: [{ code: "Stays mounted", kind: "none", note: "No `useEffect` cleanup." }] },
      ],
    },
    android: {
      state: "CREATED (stopped)",
      groups: [
        {
          title: "Activity",
          rows: [
            { code: "`onPause()`" },
            { code: "`onStop()`", note: "No longer visible." },
            { code: "`onSaveInstanceState()`", note: "After `onStop` (API 28+). Saves `rememberSaveable` state." },
          ],
        },
        {
          title: "Compose",
          rows: [
            { code: "`ON_PAUSE`, then `ON_STOP`", note: "Each before the matching Activity method." },
            {
              code: "Composition stays",
              kind: "none",
              note: "No `onDispose`. `LaunchedEffect`s keep running; `collectAsStateWithLifecycle` pauses.",
            },
          ],
        },
      ],
    },
    ios: {
      state: ".background → suspended",
      groups: [
        {
          title: "Scene delegate",
          rows: [
            { code: "`sceneWillResignActive(_:)`", note: "`scenePhase` is `.inactive`." },
            { code: "`sceneDidEnterBackground(_:)`", note: "`scenePhase` is `.background`. Save here." },
            { code: "Suspended soon after", kind: "none", note: "No callback. Your code stops running." },
          ],
        },
        { title: "SwiftUI view", rows: [{ code: "Views stay in the hierarchy", kind: "none", note: "React to `scenePhase` instead." }] },
      ],
    },
  },
  foreground: {
    rn: {
      state: "'active'",
      groups: [
        { title: "AppState", rows: [{ code: "`change` → `'active'`" }] },
        { title: "Component", rows: [{ code: "Same tree, same state", kind: "none" }] },
      ],
    },
    android: {
      state: "RESUMED",
      groups: [
        {
          title: "Activity",
          rows: [{ code: "`onRestart()`" }, { code: "`onStart()`" }, { code: "`onResume()`" }],
        },
        {
          title: "Compose",
          rows: [
            { code: "`ON_START`, then `ON_RESUME`", note: "Each after the matching Activity method returns." },
            { code: "Same composition", kind: "none", note: "`remember` values intact. Effects didn't restart." },
          ],
        },
      ],
    },
    ios: {
      state: ".active",
      groups: [
        {
          title: "Scene delegate",
          rows: [
            { code: "`sceneWillEnterForeground(_:)`", note: "`scenePhase` is `.inactive`." },
            { code: "`sceneDidBecomeActive(_:)`", note: "`scenePhase` is `.active`." },
          ],
        },
        { title: "SwiftUI view", rows: [{ code: "Same views, same `@State`", kind: "none" }] },
      ],
    },
  },
  rotate: {
    rn: {
      state: "'active'",
      groups: [
        { title: "AppState", rows: [{ code: "No `change` event", kind: "none", note: "Still `'active'`." }] },
        {
          title: "Component",
          rows: [
            { code: "`Dimensions` `change`", note: "`useWindowDimensions` re-renders with the new size." },
            { code: "Nothing remounts", kind: "none", note: "The template's `configChanges` keeps the Activity alive." },
          ],
        },
      ],
    },
    android: {
      state: "RESUMED (new Activity)",
      groups: [
        {
          title: "Activity",
          rows: [
            { code: "Old instance", kind: "divider" },
            { code: "`onPause()`" },
            { code: "`onStop()`" },
            { code: "`onSaveInstanceState()`" },
            { code: "`onDestroy()`" },
            { code: "New instance", kind: "divider" },
            { code: "`onCreate(savedInstanceState)`", note: "Gets the Bundle just saved." },
            ...ANDROID_START,
          ],
        },
        {
          title: "Compose",
          rows: [
            { code: "Old composition is disposed", note: "`onDispose { }` runs and `LaunchedEffect`s are cancelled, before `ON_DESTROY`." },
            { code: "New composition", note: "`remember` starts over. `rememberSaveable` is restored. Same `ViewModel`." },
            { code: "Effects start again" },
          ],
        },
      ],
    },
    ios: {
      state: ".active",
      groups: [
        { title: "Scene delegate", rows: [{ code: "No lifecycle callback", kind: "none", note: "The scene stays `.active`." }] },
        {
          title: "Views",
          rows: [
            { code: "`viewWillTransition(to:with:)`", note: "UIKit view controllers only." },
            { code: "`body` re-runs", note: "For views that read size class or geometry." },
            { code: "`@State` and `.task` carry on", kind: "none" },
          ],
        },
      ],
    },
  },
  kill: {
    rn: {
      state: "Not running",
      groups: [
        { title: "AppState", rows: [{ code: "No `change` event", kind: "none" }] },
        { title: "Component", rows: [{ code: "No `useEffect` cleanup", kind: "none", note: "The JS runtime goes with the process." }] },
      ],
    },
    android: {
      state: "Process gone",
      groups: [
        {
          title: "Activity",
          rows: [{ code: "No callback", kind: "none", note: "The system kills the whole process. `onDestroy` isn't guaranteed." }],
        },
        { title: "Compose", rows: [{ code: "Nothing runs", kind: "none", note: "No `onDispose`. The system keeps the saved Bundle." }] },
      ],
    },
    ios: {
      state: "Not running",
      groups: [
        {
          title: "App delegate",
          rows: [{ code: "No callback", kind: "none", note: "A suspended app is terminated without notice. No `applicationWillTerminate`." }],
        },
        { title: "SwiftUI view", rows: [{ code: "Nothing runs", kind: "none", note: "No `onDisappear`, no task cancellation." }] },
      ],
    },
  },
  relaunch: {
    rn: {
      state: "'active'",
      groups: [
        { title: "AppState", rows: [{ code: "No `change` event", kind: "none", note: "It's a cold start." }] },
        {
          title: "Component",
          rows: [
            { code: "Everything mounts again", note: "Only state you persisted survives." },
            { code: "`useEffect` runs" },
          ],
        },
      ],
    },
    android: {
      state: "RESUMED (restored)",
      groups: [
        {
          title: "Activity",
          rows: [{ code: "`onCreate(savedInstanceState)`", note: "New process, saved Bundle restored." }, ...ANDROID_START],
        },
        {
          title: "Compose",
          rows: [
            { code: "New composition", note: "`remember` starts over. `rememberSaveable` is restored." },
            { code: "New `ViewModel`", note: "Its `SavedStateHandle` is restored." },
            { code: "Effects start again" },
          ],
        },
      ],
    },
    ios: {
      state: ".active",
      groups: [
        { title: "App & scene delegate", rows: IOS_COLD },
        {
          title: "SwiftUI view",
          rows: [
            { code: "`@State` starts over", note: "`@SceneStorage` values are restored." },
            { code: "`.onAppear` and `.task` run" },
          ],
        },
      ],
    },
  },
};

export function LifecycleExplorer() {
  const [history, setHistory] = useState<EventId[]>([]);
  const [landscape, setLandscape] = useState(false);
  const last = history.at(-1) ?? null;
  const phase: Phase = last ? NEXT_PHASE[last] : "off";

  function fire(e: EventId) {
    setHistory((h) => [...h, e]);
    if (e === "rotate") setLandscape((l) => !l);
  }

  function reset() {
    setHistory([]);
    setLandscape(false);
  }

  return (
    <figure className="max-w-5xl overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <style>{LIFECYCLE_CSS}</style>
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Interactive</span>
        <span className="text-sm text-zinc-700">Step through app events and see what fires</span>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {BUTTONS.map((b) => (
            <button
              key={b.id}
              type="button"
              disabled={!b.enabled(phase)}
              onClick={() => fire(b.id)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm hover:border-zinc-500 active:bg-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300 disabled:shadow-none"
            >
              {b.label}
            </button>
          ))}
          <button type="button" onClick={reset} className="px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-900">
            Reset
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Phone phase={phase} landscape={landscape} />
          <div className="min-w-0 flex-1">
            <ol aria-label="Events so far" className="flex flex-wrap items-center gap-1 font-mono text-[11px] text-zinc-500">
              <li>not running</li>
              {history.map((e, i) => (
                <li key={i} className={i === history.length - 1 ? "font-semibold text-zinc-900" : ""}>
                  → {EVENT_LABEL[e]}
                </li>
              ))}
            </ol>
            <p aria-live="polite" className="mt-1 text-sm font-medium text-zinc-900">
              {last ? SUMMARY[last] : "Press Launch, then try backgrounding, rotating, and a process kill."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          {PLATFORMS.map((p) => (
            <PlatformColumn key={p.id} platform={p.id} label={p.label} outcome={last ? OUTCOMES[last][p.id] : null} step={history.length} />
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          Rows within a group are in documented order. How the groups interleave isn&apos;t documented except where a
          note says so. Assumes a SwiftUI app with a scene delegate, and an Android Activity that doesn&apos;t opt out of
          recreation with <code className="font-mono">configChanges</code>.
        </p>
      </div>
    </figure>
  );
}

function PlatformColumn({
  platform,
  label,
  outcome,
  step,
}: {
  platform: Platform;
  label: string;
  outcome: Outcome | null;
  step: number;
}) {
  let index = 0;
  return (
    <div data-platform={platform} className="min-w-0 md:flex-1">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-900">
        <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[platform].dot}`} />
        {label}
        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-normal text-zinc-600">
          {outcome?.state ?? "not running"}
        </span>
      </div>
      {outcome ? (
        <div key={step} className="space-y-3">
          {outcome.groups.map((g) => (
            <div key={g.title}>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{g.title}</div>
              <ol className="space-y-1">
                {g.rows.map((r, i) => {
                  const delay = { animationDelay: `${index++ * 70}ms` };
                  if (r.kind === "divider") {
                    return (
                      <li key={i} style={delay} className="lce-in pt-1 text-[11px] italic text-zinc-500">
                        {r.code}
                      </li>
                    );
                  }
                  const none = r.kind === "none";
                  return (
                    <li
                      key={i}
                      style={delay}
                      className={`lce-in rounded-md border px-2.5 py-1.5 ${
                        none ? "border-dashed border-zinc-300 bg-zinc-50/60" : `${PLATFORM_STYLE[platform].border} bg-white`
                      }`}
                    >
                      <div className={`break-words text-xs ${none ? "italic text-zinc-600" : "font-medium text-zinc-900"}`}>
                        <Inline text={r.code} />
                      </div>
                      {r.note ? (
                        <div className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                          <Inline text={r.note} />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-200 px-2.5 py-3 text-xs text-zinc-400">Nothing yet.</div>
      )}
    </div>
  );
}

function Phone({ phase, landscape }: { phase: Phase; landscape: boolean }) {
  const screen =
    phase === "foreground" ? "fill-sky-100" : phase === "background" ? "fill-zinc-300" : "fill-zinc-800";
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" role="img" aria-label={`App is ${PHASE_LABEL[phase]}`}>
      <g className="lce-phone" style={{ transform: landscape ? "rotate(90deg)" : "rotate(0deg)" }}>
        <rect x="18" y="6" width="28" height="52" rx="5" className="fill-white stroke-zinc-400" strokeWidth="2" />
        <rect x="21" y="11" width="22" height="40" rx="2" className={`lce-screen ${screen}`} />
        {phase === "foreground" ? (
          <>
            <rect x="24" y="15" width="16" height="3" rx="1" className="fill-sky-400" />
            <rect x="24" y="21" width="12" height="2" rx="1" className="fill-sky-300" />
            <rect x="24" y="25" width="14" height="2" rx="1" className="fill-sky-300" />
          </>
        ) : null}
        {phase === "killed" ? (
          <path d="M26 25 L38 37 M38 25 L26 37" className="stroke-rose-400" strokeWidth="2.5" strokeLinecap="round" />
        ) : null}
        <rect x="28" y="54" width="8" height="1.5" rx="0.75" className="fill-zinc-300" />
      </g>
    </svg>
  );
}

const PHASE_LABEL: Record<Phase, string> = {
  off: "not running",
  foreground: "in the foreground",
  background: "in the background",
  killed: "killed",
};

const LIFECYCLE_CSS = `
@keyframes lce-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}
.lce-in { animation: lce-in 0.3s ease-out both; }
.lce-phone { transform-origin: 32px 32px; transform-box: view-box; transition: transform 0.4s ease; }
.lce-screen { transition: fill 0.3s ease; }
@media (prefers-reduced-motion: reduce) {
  .lce-in { animation: none; }
  .lce-phone, .lce-screen { transition: none; }
}
`;
