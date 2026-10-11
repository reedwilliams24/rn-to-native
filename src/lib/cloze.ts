import type { ExercisePlatform } from "@/content/types";

export type CodeToken = { text: string; color?: string };
export type CodeSegment = CodeToken | { blank: number };

export type Cloze = {
  lines: CodeSegment[][];
  /** Per blank: the solution text first, then extra accepted variants */
  answers: string[][];
  hints: string[];
  solutionHtml: string;
};

export type ExerciseData = {
  id: string;
  title: string;
  prompt: string;
  rnHtml: string;
  platforms: Record<ExercisePlatform, Cloze>;
};

/** Collapse whitespace runs and drop whitespace around punctuation, so `count+=1` matches `count += 1`. */
export function normalizeAnswer(s: string) {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ ?([^\w\s]) ?/g, "$1");
}

export function isAccepted(value: string, accepted: string[]) {
  const v = normalizeAnswer(value);
  return v.length > 0 && accepted.some((a) => normalizeAnswer(a) === v);
}
