export type Platform = "rn" | "android" | "ios";

export const PLATFORMS: { id: Platform; label: string; sub: string; lang: string; ext: string }[] = [
  { id: "rn", label: "React Native", sub: "TypeScript", lang: "tsx", ext: "tsx" },
  { id: "android", label: "Android", sub: "Kotlin · Jetpack Compose", lang: "kotlin", ext: "kt" },
  { id: "ios", label: "iOS", sub: "Swift · SwiftUI", lang: "swift", ext: "swift" },
];

export type PerPlatform<T> = Record<Platform, T>;

export type Section = {
  id: string;
  title: string;
  prose: string[];
  /** Folder under content/<chapter>/ containing rn.tsx, android.kt, ios.swift */
  snippet?: string;
  notes?: Partial<PerPlatform<string[]>>;
  compare?: { label: string; values: PerPlatform<string> }[];
  callout?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  /** Index into options */
  answer: number;
  explanation: string;
};

export type Chapter = {
  slug: string;
  title: string;
  intro: string[];
  sections: Section[];
  gotchas: { title: string; body: string }[];
  cheatsheet: PerPlatform<string>[];
  quiz: QuizQuestion[];
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
