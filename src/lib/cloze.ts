import type { ExercisePlatform } from "@/content/types";

export type CodeToken = { text: string; color?: string };
export type CodeSegment = CodeToken | { blank: number };

export type Cloze = {
  lines: CodeSegment[][];
  /** Per blank: the solution text */
  answers: string[];
  /** Per blank: the word bank, the answer shuffled in with its distractors */
  options: string[][];
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
