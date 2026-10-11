"use client";

import { memo, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  PLATFORMS,
  type BugQuestion,
  type ChoiceQuestion,
  type OrderQuestion,
  type PredictQuestion,
  type QuizAnswer,
  type QuizQuestion,
} from "@/content/types";
import { Inline } from "@/lib/inline";
import { recordAnswer, resetQuiz, useProgress } from "@/lib/progress";
import { initialOrder, isCorrect, validAnswer } from "@/lib/quiz";
import { PLATFORM_STYLE } from "./platform";

const plain = (text: string) => text.replace(/[`*]/g, "");

const PROMPT: Record<NonNullable<QuizQuestion["kind"]>, string | null> = {
  choice: null,
  predict: "Predict the output",
  bug: "Spot the bug",
  order: "Put in order",
};

export function Quiz({
  slug,
  questions,
  code = [],
}: {
  slug: string;
  questions: QuizQuestion[];
  /** Highlighted HTML lines per question, for predict and bug questions */
  code?: (string[] | null)[];
}) {
  const saved = useProgress().chapters[slug]?.answers ?? [];
  const picked = questions.map((q, i) => validAnswer(q, saved[i]));
  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => isCorrect(questions[i], p)).length;

  return (
    <div className="max-w-3xl space-y-6">
      {questions.map((q, qi) => {
        const choice = picked[qi];
        const done = choice !== null;
        const right = isCorrect(q, choice);
        const prompt = PROMPT[q.kind ?? "choice"];
        const submit = (a: NonNullable<QuizAnswer>) => recordAnswer(slug, questions, qi, a);
        return (
          <div key={qi} className="rounded-lg border border-zinc-200 p-5">
            {prompt ? (
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">{prompt}</div>
            ) : null}
            <div id={`${slug}-q${qi}`} className="font-medium text-zinc-900">
              <span className="mr-2 text-zinc-400">{qi + 1}.</span>
              <Inline text={q.question} />
            </div>
            {q.kind === "predict" ? (
              <>
                <CodeBlock q={q} lines={code[qi]} />
                <Options q={q} choice={choice as number | null} onPick={submit} />
              </>
            ) : q.kind === "bug" ? (
              <BugLines q={q} lines={code[qi]} choice={choice as number | null} onPick={submit} labelledBy={`${slug}-q${qi}`} />
            ) : q.kind === "order" ? (
              <OrderList key={done ? "done" : "draft"} q={q} choice={choice as number[] | null} onSubmit={submit} />
            ) : (
              <Options q={q} choice={choice as number | null} onPick={submit} />
            )}
            {done ? (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                <span className={`font-medium ${right ? "text-emerald-700" : "text-rose-700"}`}>
                  {right ? "Correct. " : "Not quite. "}
                </span>
                <Inline text={q.explanation} />
              </p>
            ) : null}
          </div>
        );
      })}
      <div className="flex items-center gap-4 text-sm text-zinc-600">
        <span>
          {answered === questions.length
            ? `You got ${correct} of ${questions.length}.`
            : `${answered} of ${questions.length} answered`}
        </span>
        {answered > 0 ? (
          <button
            type="button"
            onClick={() => resetQuiz(slug)}
            className="rounded-md border border-zinc-300 px-3 py-1 hover:bg-zinc-50"
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Options({
  q,
  choice,
  onPick,
}: {
  q: ChoiceQuestion | PredictQuestion;
  choice: number | null;
  onPick: (i: number) => void;
}) {
  const done = choice !== null;
  return (
    <div className="mt-3 space-y-2">
      {q.options.map((opt, oi) => {
        const isAnswer = oi === q.answer;
        const isChoice = oi === choice;
        const tone = !done
          ? "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
          : isAnswer
            ? "border-emerald-500 bg-emerald-50 text-emerald-950"
            : isChoice
              ? "border-rose-400 bg-rose-50 text-rose-950"
              : "border-zinc-200 text-zinc-400";
        return (
          <button
            key={oi}
            type="button"
            disabled={done}
            onClick={() => onPick(oi)}
            className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${tone}`}
          >
            <Inline text={opt} />
            <Verdict show={done} isAnswer={isAnswer} isChoice={isChoice} answerLabel="Correct answer" />
          </button>
        );
      })}
    </div>
  );
}

function Verdict({
  show,
  isAnswer,
  isChoice,
  answerLabel,
  dark,
}: {
  show: boolean;
  isAnswer: boolean;
  isChoice: boolean;
  answerLabel: string;
  dark?: boolean;
}) {
  if (!show || (!isAnswer && !isChoice)) return null;
  const tone = isAnswer ? (dark ? "text-emerald-300" : "text-emerald-700") : dark ? "text-rose-300" : "text-rose-700";
  return (
    <span className={`ml-2 whitespace-nowrap font-sans text-xs font-medium ${tone}`}>
      {isAnswer ? `✓ ${answerLabel}` : "✗ Your answer"}
    </span>
  );
}

function CodeHeader({ platform }: { platform: PredictQuestion["platform"] }) {
  const p = PLATFORMS.find((x) => x.id === platform)!;
  return (
    <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-900 px-3 py-2">
      <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[p.id].dot}`} />
      <span className="text-sm font-medium text-zinc-100">{p.label}</span>
      <span className="text-xs text-zinc-400">{p.sub}</span>
    </div>
  );
}

// Memoized so re-renders (e.g. focus moving between lines) don't reset innerHTML mid-click.
const CodeHtml = memo(function CodeHtml({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
});

const CODE_BOX = "overflow-x-auto rounded-b-lg border border-zinc-800 bg-[#0d1117] py-3 font-mono text-[12.5px] leading-relaxed";

function CodeBlock({ q, lines }: { q: PredictQuestion; lines?: string[] | null }) {
  return (
    <div className="mt-3">
      <CodeHeader platform={q.platform} />
      <pre className={`${CODE_BOX} px-4`}>
        {lines ? (
          lines.map((html, i) => <CodeHtml key={i} html={html} className="block min-h-[1lh]" />)
        ) : (
          <code className="text-zinc-200">{q.code.trimEnd()}</code>
        )}
      </pre>
    </div>
  );
}

function BugLines({
  q,
  lines,
  choice,
  onPick,
  labelledBy,
}: {
  q: BugQuestion;
  lines?: string[] | null;
  choice: number | null;
  onPick: (line: number) => void;
  labelledBy: string;
}) {
  const done = choice !== null;
  const raw = q.code.trimEnd().split("\n");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focus, setFocus] = useState(0);

  function onKeyDown(e: KeyboardEvent, i: number) {
    const last = raw.length - 1;
    const next =
      e.key === "ArrowDown" ? Math.min(i + 1, last) : e.key === "ArrowUp" ? Math.max(i - 1, 0) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    setFocus(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="mt-3">
      <CodeHeader platform={q.platform} />
      <div role="group" aria-labelledby={labelledBy} className={CODE_BOX}>
        {!done ? (
          <p className="sticky left-0 px-4 pb-2 font-sans text-xs text-zinc-400">
            Click the buggy line, or use ↑/↓ and Enter.
          </p>
        ) : null}
        <div className="w-max min-w-full">
        {raw.map((text, i) => {
          const line = i + 1;
          const isAnswer = line === q.answer;
          const isChoice = line === choice;
          const tone = !done
            ? "hover:bg-white/10 focus-visible:bg-white/10"
            : isAnswer
              ? "bg-emerald-500/20 shadow-[inset_3px_0_0_#10b981]"
              : isChoice
                ? "bg-rose-500/20 shadow-[inset_3px_0_0_#fb7185]"
                : "opacity-60";
          return (
            <button
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              disabled={done}
              tabIndex={i === focus ? 0 : -1}
              aria-label={`Line ${line}: ${text.trim() || "blank"}`}
              onClick={() => onPick(line)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onFocus={() => setFocus(i)}
              className={`flex w-full items-baseline whitespace-pre pr-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400 ${tone}`}
            >
              <span aria-hidden className="sticky left-0 flex w-12 shrink-0 select-none justify-end gap-1 bg-[#0d1117] pr-3 text-zinc-600">
                {done && isAnswer ? <span className="text-emerald-300">✓</span> : done && isChoice ? <span className="text-rose-300">✗</span> : null}
                {line}
              </span>
              {lines?.[i] !== undefined ? (
                <CodeHtml html={lines[i]} />
              ) : (
                <span className="text-zinc-200">{text}</span>
              )}
              <Verdict show={done} isAnswer={isAnswer} isChoice={isChoice} answerLabel="The bug" dark />
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}

function OrderList({
  q,
  choice,
  onSubmit,
}: {
  q: OrderQuestion;
  choice: number[] | null;
  onSubmit: (order: number[]) => void;
}) {
  const done = choice !== null;
  const [order, setOrder] = useState(() => choice ?? initialOrder(q));
  const [dragging, setDragging] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const pendingFocus = useRef<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    listRef.current?.querySelector<HTMLElement>(`[data-focus="${pendingFocus.current}"]`)?.focus();
    pendingFocus.current = null;
  });

  const orderRef = useRef(order);
  orderRef.current = order;

  function move(from: number, to: number, focusKey?: string) {
    const current = orderRef.current;
    if (to < 0 || to >= current.length || from === to) return;
    const next = [...current];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    orderRef.current = next;
    setOrder(next);
    setStatus(`${plain(q.items[item])} moved to position ${to + 1} of ${next.length}.`);
    if (focusKey) pendingFocus.current = focusKey;
  }
  const moveRef = useRef(move);
  moveRef.current = move;

  // Track the drag on window: reordering moves DOM nodes, which would drop pointer capture on the handle.
  useEffect(() => {
    if (dragging === null) return;
    const onMove = (e: globalThis.PointerEvent) => {
      const row = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-order-pos]");
      if (!row || !listRef.current?.contains(row)) return;
      moveRef.current(orderRef.current.indexOf(dragging), Number(row.dataset.orderPos));
    };
    const stop = () => setDragging(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging]);

  function onHandleKey(e: KeyboardEvent, pos: number) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    move(pos, e.key === "ArrowUp" ? pos - 1 : pos + 1, `handle-${order[pos]}`);
  }

  function onPointerDown(e: PointerEvent, item: number) {
    if (e.button !== 0) return;
    e.preventDefault();
    setDragging(item);
  }

  return (
    <div className="mt-3">
      {!done ? (
        <p className="mb-2 text-xs text-zinc-500">Drag the handle, use the arrow buttons, or focus a handle and press ↑/↓.</p>
      ) : null}
      <ol ref={listRef} className="space-y-2">
        {order.map((item, pos) => {
          const ok = item === pos;
          const tone = !done
            ? dragging === item
              ? "border-sky-400 bg-sky-50 shadow-sm"
              : "border-zinc-200 bg-white"
            : ok
              ? "border-emerald-500 bg-emerald-50 text-emerald-950"
              : "border-rose-400 bg-rose-50 text-rose-950";
          return (
            <li
              key={item}
              data-order-pos={pos}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-colors ${tone}`}
            >
              {!done ? (
                <button
                  type="button"
                  data-focus={`handle-${item}`}
                  aria-label={`Reorder ${plain(q.items[item])}, position ${pos + 1} of ${order.length}. Use arrow keys to move.`}
                  onKeyDown={(e) => onHandleKey(e, pos)}
                  onPointerDown={(e) => onPointerDown(e, item)}
                  className="cursor-grab touch-none rounded px-1.5 py-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-sky-500 active:cursor-grabbing"
                >
                  ⠿
                </button>
              ) : null}
              <span className="w-5 shrink-0 text-right tabular-nums text-zinc-400">{pos + 1}.</span>
              <span className="flex-1">
                <Inline text={q.items[item]} />
                {done ? (
                  <span className={`ml-2 whitespace-nowrap text-xs font-medium ${ok ? "text-emerald-700" : "text-rose-700"}`}>
                    {ok ? "✓ Correct position" : `✗ Should be #${item + 1}`}
                  </span>
                ) : null}
              </span>
              {!done ? (
                <span className="flex gap-1">
                  <button
                    type="button"
                    data-focus={`up-${item}`}
                    disabled={pos === 0}
                    aria-label={`Move ${plain(q.items[item])} up`}
                    onClick={() => move(pos, pos - 1, pos - 1 === 0 ? `down-${item}` : `up-${item}`)}
                    className="rounded border border-zinc-200 px-2 py-0.5 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    data-focus={`down-${item}`}
                    disabled={pos === order.length - 1}
                    aria-label={`Move ${plain(q.items[item])} down`}
                    onClick={() => move(pos, pos + 1, pos + 1 === order.length - 1 ? `up-${item}` : `down-${item}`)}
                    className="rounded border border-zinc-200 px-2 py-0.5 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {!done ? (
        <button
          type="button"
          onClick={() => onSubmit(order)}
          className="mt-3 rounded-md border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Check order
        </button>
      ) : !isCorrect(q, choice) ? (
        <div className="mt-3 text-sm text-zinc-600">
          <div className="font-medium text-zinc-900">Correct order</div>
          <ol className="mt-1 list-decimal space-y-0.5 pl-6">
            {q.items.map((it, i) => (
              <li key={i}>
                <Inline text={it} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
