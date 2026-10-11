import type { QuizAnswer, QuizQuestion } from "@/content/types";

export function lineCount(code: string) {
  return code.trimEnd().split("\n").length;
}

/** Returns the answer if it's valid for this question (old or foreign data may not be), else null. */
export function validAnswer(q: QuizQuestion, a: QuizAnswer | undefined): QuizAnswer {
  if (a === null || a === undefined) return null;
  switch (q.kind) {
    case "order": {
      const n = q.items.length;
      if (!Array.isArray(a) || a.length !== n) return null;
      return new Set(a).size === n && a.every((x) => Number.isInteger(x) && x >= 0 && x < n) ? a : null;
    }
    case "bug":
      return Number.isInteger(a) && (a as number) >= 1 && (a as number) <= lineCount(q.code) ? a : null;
    default:
      return Number.isInteger(a) && (a as number) >= 0 && (a as number) < q.options.length ? a : null;
  }
}

export function isCorrect(q: QuizQuestion, a: QuizAnswer | undefined) {
  const v = validAnswer(q, a);
  if (v === null) return false;
  if (q.kind === "order") return (v as number[]).every((x, i) => x === i);
  return v === q.answer;
}

/** Deterministic shuffle of item indices (same on server and client), never already in order. */
export function initialOrder(q: { question: string; items: string[] }): number[] {
  const order = q.items.map((_, i) => i);
  let seed = 0;
  for (const ch of q.question) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (order.length > 1 && order.every((x, i) => x === i)) order.push(order.shift()!);
  return order;
}
