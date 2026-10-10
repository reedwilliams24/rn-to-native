"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { Inline } from "@/lib/inline";

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === questions[i].answer).length;

  return (
    <div className="max-w-3xl space-y-6">
      {questions.map((q, qi) => {
        const choice = picked[qi];
        const done = choice !== null;
        return (
          <div key={qi} className="rounded-lg border border-zinc-200 p-5">
            <div className="font-medium text-zinc-900">
              <span className="mr-2 text-zinc-400">{qi + 1}.</span>
              <Inline text={q.question} />
            </div>
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
                    onClick={() => setPicked((prev) => prev.map((p, i) => (i === qi ? oi : p)))}
                    className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${tone}`}
                  >
                    <Inline text={opt} />
                  </button>
                );
              })}
            </div>
            {done ? (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                <span className={`font-medium ${choice === q.answer ? "text-emerald-700" : "text-rose-700"}`}>
                  {choice === q.answer ? "Correct. " : "Not quite. "}
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
            onClick={() => setPicked(questions.map(() => null))}
            className="rounded-md border border-zinc-300 px-3 py-1 hover:bg-zinc-50"
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}
