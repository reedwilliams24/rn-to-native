"use client";

import { useState } from "react";
import { PLATFORMS, type Platform, type PerPlatform } from "@/content/types";
import { Inline } from "@/lib/inline";
import { PLATFORM_STYLE } from "../platform";

type Change = "count" | "name" | "todos";
type NodeId = "header" | "counter" | "greeting" | "todos";
type Result = { ran: boolean; reason: string };
type Options = { memo: boolean; strongSkipping: boolean };

const CHILDREN: NodeId[] = ["header", "counter", "greeting", "todos"];
const READS: Record<NodeId, Change | null> = { header: null, counter: "count", greeting: "name", todos: "todos" };
const NAMES = ["Ada", "Grace", "Linus", "Margaret"];

const VERB: PerPlatform<{ ran: string; skipped: string; count: string }> = {
  rn: { ran: "re-rendered", skipped: "skipped", count: "renders" },
  android: { ran: "recomposed", skipped: "skipped", count: "recompositions" },
  ios: { ran: "body ran", skipped: "body skipped", count: "body calls" },
};

const LABELS: PerPlatform<{ screen: string; state: string } & Record<NodeId, { code: string; hint?: string }>> = {
  rn: {
    screen: "function Screen()",
    state: "useState × 3",
    header: { code: '<Header title="Profile" />' },
    counter: { code: "<Counter count={count} />" },
    greeting: { code: "<Greeting name={name} />" },
    todos: { code: "<TodoList todos={todos} />" },
  },
  android: {
    screen: "@Composable fun Screen()",
    state: "remember { mutableStateOf(…) } × 3",
    header: { code: 'Header(title = "Profile")', hint: "String · stable" },
    counter: { code: "Counter(count)", hint: "Int · stable" },
    greeting: { code: "Greeting(name)", hint: "String · stable" },
    todos: { code: "TodoList(todos)", hint: "List<Todo> · unstable" },
  },
  ios: {
    screen: "struct Screen: View",
    state: "@State × 3",
    header: { code: 'Header(title: "Profile")' },
    counter: { code: "Counter(count: count)" },
    greeting: { code: "Greeting(name: name)" },
    todos: { code: "TodoList(todos: todos)", hint: "[Todo] · value type" },
  },
};

function screenResult(platform: Platform, change: Change): Result {
  const reason: PerPlatform<string> = {
    rn: `Owns the \`${change}\` state that changed.`,
    android: `Read \`${change}\` during composition.`,
    ios: `\`body\` read \`@State ${change}\`.`,
  };
  return { ran: true, reason: reason[platform] };
}

function childResult(platform: Platform, node: NodeId, change: Change, opts: Options): Result {
  const changed = READS[node] === change;
  if (platform === "rn") {
    if (!opts.memo) return { ran: true, reason: "Its parent re-rendered." };
    if (!changed) return { ran: false, reason: "`memo`: every prop is `Object.is`-equal." };
    return { ran: true, reason: node === "todos" ? "`memo`: `todos` is a new array." : `\`memo\`: \`${change}\` changed.` };
  }
  if (platform === "android") {
    if (changed) return { ran: true, reason: node === "todos" ? "New list instance." : `\`${change}\` changed.` };
    if (node === "todos") {
      return opts.strongSkipping
        ? { ran: false, reason: "Strong skipping: same instance (`===`)." }
        : { ran: true, reason: "`List` is unstable, so it can't skip." };
    }
    return { ran: false, reason: "Stable inputs, `equals()` the old ones." };
  }
  if (changed) return { ran: true, reason: `\`${change}\` has a new value.` };
  return { ran: false, reason: "Inputs unchanged." };
}

function results(platform: Platform, change: Change, opts: Options): { screen: Result } & Record<NodeId, Result> {
  const r = { screen: screenResult(platform, change) } as { screen: Result } & Record<NodeId, Result>;
  for (const n of CHILDREN) r[n] = childResult(platform, n, change, opts);
  return r;
}

const ZERO_COUNTS = (): PerPlatform<Record<"screen" | NodeId, number>> =>
  Object.fromEntries(
    PLATFORMS.map((p) => [p.id, { screen: 1, header: 1, counter: 1, greeting: 1, todos: 1 }]),
  ) as PerPlatform<Record<"screen" | NodeId, number>>;

const CHANGE_LABEL: Record<Change, string> = { count: "count += 1", name: "rename", todos: "add a todo" };

export function RecompositionVisualizer() {
  const [mode, setMode] = useState<"rerun" | "identity">("rerun");
  return (
    <figure className="max-w-5xl overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <style>{FLASH_CSS}</style>
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Interactive</span>
        {(
          [
            ["rerun", "What re-runs?"],
            ["identity", "What keeps its state?"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={`rounded-full border px-3 py-1 text-sm ${
              mode === id ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "rerun" ? <RerunPanel /> : <IdentityPanel />}
    </figure>
  );
}

function RerunPanel() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState(0);
  const [todos, setTodos] = useState(2);
  const [opts, setOpts] = useState<Options>({ memo: false, strongSkipping: true });
  const [last, setLast] = useState<Change | null>(null);
  const [tick, setTick] = useState(0);
  const [counts, setCounts] = useState(ZERO_COUNTS);

  function apply(change: Change) {
    if (change === "count") setCount((c) => c + 1);
    if (change === "name") setName((n) => (n + 1) % NAMES.length);
    if (change === "todos") setTodos((t) => t + 1);
    setCounts((prev) => {
      const next = structuredClone(prev);
      for (const p of PLATFORMS) {
        const r = results(p.id, change, opts);
        next[p.id].screen += 1;
        for (const n of CHILDREN) if (r[n].ran) next[p.id][n] += 1;
      }
      return next;
    });
    setLast(change);
    setTick((t) => t + 1);
  }

  function reset() {
    setCount(0);
    setName(0);
    setTodos(2);
    setLast(null);
    setCounts(ZERO_COUNTS());
  }

  const summary = last
    ? PLATFORMS.map((p) => {
        const r = results(p.id, last, opts);
        const ran = 1 + CHILDREN.filter((n) => r[n].ran).length;
        return `${p.label}: ${ran} of 5 ${VERB[p.id].ran}`;
      }).join(" · ")
    : "Pick a state change to see what each framework re-runs.";

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(CHANGE_LABEL) as Change[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => apply(c)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-mono text-sm text-zinc-900 shadow-sm hover:border-zinc-500 active:bg-zinc-100"
          >
            {CHANGE_LABEL[c]}
          </button>
        ))}
        <button type="button" onClick={reset} className="px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-900">
          Reset
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={opts.memo} onChange={(e) => setOpts({ ...opts, memo: e.target.checked })} />
          <span>
            <Inline text="React: wrap children in `memo`" />
          </span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={opts.strongSkipping}
            onChange={(e) => setOpts({ ...opts, strongSkipping: e.target.checked })}
          />
          <span>Compose: strong skipping (default from Kotlin 2.0.20)</span>
        </label>
      </div>
      <div className="mt-3 rounded-md bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-600">
        count = {count} · name = &quot;{NAMES[name]}&quot; · todos = [{todos} items]
      </div>
      <p aria-live="polite" className="mt-3 text-sm font-medium text-zinc-900">
        {last ? <span className="mr-1 font-mono text-zinc-500">{CHANGE_LABEL[last]} →</span> : null}
        {summary}
      </p>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        {PLATFORMS.map((p) => {
          const r = last ? results(p.id, last, opts) : null;
          const l = LABELS[p.id];
          return (
            <div key={p.id} data-platform={p.id} className="min-w-0 md:flex-1">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-900">
                <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[p.id].dot}`} />
                {p.label}
              </div>
              <TreeNode
                code={l.screen}
                hint={l.state}
                result={r?.screen}
                runs={counts[p.id].screen}
                platform={p.id}
                tick={tick}
              />
              <ul className="ml-3 mt-1.5 space-y-1.5 border-l border-zinc-200 pl-3">
                {CHILDREN.map((n) => (
                  <li key={n} className="relative before:absolute before:-left-3 before:top-4 before:h-px before:w-3 before:bg-zinc-200">
                    <TreeNode
                      code={l[n].code}
                      hint={l[n].hint}
                      result={r?.[n]}
                      runs={counts[p.id][n]}
                      platform={p.id}
                      tick={tick}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        A model of each framework&apos;s documented rules, not a profiler. Counts start at 1 for the first render.
      </p>
    </div>
  );
}

function TreeNode({
  code,
  hint,
  result,
  runs,
  platform,
  tick,
}: {
  code: string;
  hint?: string;
  result?: Result;
  runs: number;
  platform: Platform;
  tick: number;
}) {
  const tone = !result
    ? "border-zinc-200 bg-white"
    : result.ran
      ? "border-amber-400 bg-amber-50"
      : "border-dashed border-zinc-300 bg-zinc-50/60";
  return (
    <div
      key={result?.ran ? tick : "idle"}
      className={`rounded-md border px-2.5 py-1.5 ${tone} ${result?.ran ? "rcv-flash" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <code className="min-w-0 break-words font-mono text-xs text-zinc-900">{code}</code>
        <span className="shrink-0 font-mono text-[11px] text-zinc-500" title={VERB[platform].count}>
          ×{runs}
        </span>
      </div>
      {hint ? <div className="mt-0.5 font-mono text-[11px] text-zinc-400">{hint}</div> : null}
      {result ? (
        <div className={`mt-1 text-xs ${result.ran ? "text-amber-900" : "text-zinc-500"}`}>
          <span className="font-semibold">{result.ran ? VERB[platform].ran : VERB[platform].skipped}.</span>{" "}
          <Inline text={result.reason} />
        </div>
      ) : null}
    </div>
  );
}

type Style = "branch" | "single";

const IDENTITY_CODE: Record<Style, PerPlatform<string>> = {
  branch: {
    rn: "{highlight\n  ? <Counter fancy />\n  : <Counter />}",
    android: "if (highlight) {\n  Counter(fancy = true)\n} else {\n  Counter()\n}",
    ios: "if highlight {\n  Counter().border(.red)\n} else {\n  Counter()\n}",
  },
  single: {
    rn: "<Counter fancy={highlight} />",
    android: "Counter(fancy = highlight)",
    ios: "Counter()\n  .border(highlight ? .red : .clear)",
  },
};

const STATE_NAME: PerPlatform<string> = { rn: "useState", android: "remember", ios: "@State" };

function keepsState(platform: Platform, style: Style) {
  return style === "single" || platform === "rn";
}

const IDENTITY_REASON: Record<Style, PerPlatform<string>> = {
  branch: {
    rn: "Same component type at the same position, so React keeps its state.",
    android: "The `if` and `else` calls are two call sites, so two instances. `remember` starts over.",
    ios: "Each `if` branch is a view with its own identity, so `@State` starts over.",
  },
  single: {
    rn: "Same element at the same position; only a prop changed.",
    android: "One call site; only an argument changed.",
    ios: "One view; only the modifier's value changed.",
  },
};

function IdentityPanel() {
  const [style, setStyle] = useState<Style>("branch");
  const [highlight, setHighlight] = useState(false);
  const [counts, setCounts] = useState<PerPlatform<number>>({ rn: 0, android: 0, ios: 0 });
  const [toggled, setToggled] = useState(false);
  const [tick, setTick] = useState(0);

  function pickStyle(s: Style) {
    setStyle(s);
    setHighlight(false);
    setCounts({ rn: 0, android: 0, ios: 0 });
    setToggled(false);
  }

  function increment() {
    setCounts((c) => ({ rn: c.rn + 1, android: c.android + 1, ios: c.ios + 1 }));
    setToggled(false);
  }

  function toggle() {
    setHighlight((h) => !h);
    setCounts((c) => ({
      rn: keepsState("rn", style) ? c.rn : 0,
      android: keepsState("android", style) ? c.android : 0,
      ios: keepsState("ios", style) ? c.ios : 0,
    }));
    setToggled(true);
    setTick((t) => t + 1);
  }

  const summary = toggled
    ? PLATFORMS.map((p) => `${p.label}: ${keepsState(p.id, style) ? "kept" : "reset"}`).join(" · ")
    : "Tap +1 a few times, then toggle the highlight.";

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-zinc-500">Written as</span>
        {(
          [
            ["branch", "if / else branch"],
            ["single", "one call, conditional value"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={style === id}
            onClick={() => pickStyle(id)}
            className={`rounded-md border px-2.5 py-1 ${
              style === id ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={increment}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-mono text-sm text-zinc-900 shadow-sm hover:border-zinc-500 active:bg-zinc-100"
        >
          tap +1 in Counter
        </button>
        <button
          type="button"
          onClick={toggle}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-mono text-sm text-zinc-900 shadow-sm hover:border-zinc-500 active:bg-zinc-100"
        >
          highlight = {String(!highlight)}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 text-sm font-medium text-zinc-900">
        {toggled ? <span className="mr-1 font-mono text-zinc-500">Counter&apos;s own state →</span> : null}
        {summary}
      </p>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        {PLATFORMS.map((p) => {
          const kept = keepsState(p.id, style);
          return (
            <div key={p.id} data-platform={p.id} className="min-w-0 md:flex-1">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-900">
                <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[p.id].dot}`} />
                {p.label}
              </div>
              <pre className="overflow-x-auto rounded-md bg-zinc-900 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-100">
                {IDENTITY_CODE[style][p.id]}
              </pre>
              <div
                key={toggled ? tick : "idle"}
                className={`mt-2 rounded-md border-2 px-3 py-2 ${highlight ? "border-rose-500" : "border-zinc-200"} ${
                  toggled && !kept ? "rcv-flash" : ""
                }`}
              >
                <div className="text-xs text-zinc-500">
                  Counter · <code className="font-mono">{STATE_NAME[p.id]}</code>
                </div>
                <div className="font-mono text-lg text-zinc-900">count = {counts[p.id]}</div>
              </div>
              {toggled ? (
                <div className={`mt-1.5 text-xs ${kept ? "text-emerald-800" : "text-rose-800"}`}>
                  <span className="font-semibold">{kept ? "State kept." : "State reset."}</span>{" "}
                  <Inline text={IDENTITY_REASON[style][p.id]} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FLASH_CSS = `
@keyframes rcv-flash {
  0% { box-shadow: 0 0 0 0 rgb(251 191 36 / 0.9); }
  100% { box-shadow: 0 0 0 10px rgb(251 191 36 / 0); }
}
.rcv-flash { animation: rcv-flash 0.8s ease-out; }
@media (prefers-reduced-motion: reduce) {
  .rcv-flash { animation: none; }
}
`;
