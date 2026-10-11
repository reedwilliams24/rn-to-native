export type Platform = "rn" | "android" | "ios";

export const PLATFORMS: { id: Platform; label: string; sub: string; lang: string; ext: string }[] = [
  { id: "rn", label: "React Native", sub: "TypeScript", lang: "tsx", ext: "tsx" },
  { id: "android", label: "Android", sub: "Kotlin · Jetpack Compose", lang: "kotlin", ext: "kt" },
  { id: "ios", label: "iOS", sub: "Swift · SwiftUI", lang: "swift", ext: "swift" },
];

export type PerPlatform<T> = Record<Platform, T>;

export type DiagramId = "recomposition";

export type Section = {
  id: string;
  title: string;
  prose: string[];
  /** Folder under content/<chapter>/ containing rn.tsx, android.kt, ios.swift */
  snippet?: string;
  notes?: Partial<PerPlatform<string[]>>;
  compare?: { label: string; values: PerPlatform<string> }[];
  callout?: string;
  /** Interactive diagram rendered after the prose */
  diagram?: DiagramId;
};

type QuizBase = { question: string; explanation: string };

/** A code block shown with a question, highlighted at build time. */
export type QuizCode = { platform: Platform; code: string };

export type ChoiceQuestion = QuizBase & {
  kind?: "choice";
  options: string[];
  /** Index into options */
  answer: number;
};

/** Predict the output or behavior of a snippet. */
export type PredictQuestion = QuizBase & QuizCode & { kind: "predict"; options: string[]; answer: number };

/** Click the faulty line. `answer` is the 1-based line number in `code`. */
export type BugQuestion = QuizBase & QuizCode & { kind: "bug"; answer: number };

/** Put `items` in order. `items` is the correct order; the quiz shuffles them. */
export type OrderQuestion = QuizBase & { kind: "order"; items: string[] };

export type QuizQuestion = ChoiceQuestion | PredictQuestion | BugQuestion | OrderQuestion;

/** A saved answer: an option index, a line number (bug), or an ordering of item indices (order). */
export type QuizAnswer = number | number[] | null;

export type ExercisePlatform = "android" | "ios";

export type ExerciseBlank = {
  hint: string;
  /** Wrong options shown in the word bank next to the solution text between the markers */
  distractors: string[];
};

export type Exercise = {
  /** Folder under content/<chapter>/exercises/ with rn.tsx, android.kt, ios.swift. Blanks in the native files are wrapped in block-comment markers: /*[*\/ answer /*]*\/ */
  id: string;
  title: string;
  prompt: string;
  /** One entry per marker, in file order */
  blanks: Record<ExercisePlatform, ExerciseBlank[]>;
};

export type Chapter = {
  slug: string;
  title: string;
  intro: string[];
  sections: Section[];
  gotchas: { title: string; body: string }[];
  cheatsheet: PerPlatform<string>[];
  quiz: QuizQuestion[];
  exercises?: Exercise[];
};

export type OutlineChapter = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  topics: string[];
};

export type OutlinePart = {
  title: string;
  chapters: OutlineChapter[];
};
