"use client";

import { useSyncExternalStore } from "react";
import type { QuizQuestion } from "@/content/types";

// All reading progress lives behind this module so a synced backend can replace localStorage later.
const STORAGE_KEY = "rn2native.progress.v1";

export type ChapterProgress = {
  answers: (number | null)[];
  correct: number;
  total: number;
  read: boolean;
  updatedAt: number;
};

export type Progress = { chapters: Record<string, ChapterProgress> };

const EMPTY: Progress = { chapters: {} };
const listeners = new Set<() => void>();
let cache: Progress | null = null;

function load(): Progress {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Progress | null;
    cache = parsed && typeof parsed.chapters === "object" && parsed.chapters ? parsed : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function save(next: Progress) {
  cache = next;
  try {
    if (Object.keys(next.chapters).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY && e.key !== null) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

function update(slug: string, fn: (prev: ChapterProgress) => ChapterProgress | null) {
  const current = load();
  const prev = current.chapters[slug] ?? { answers: [], correct: 0, total: 0, read: false, updatedAt: 0 };
  const next = fn(prev);
  const chapters = { ...current.chapters };
  if (next) chapters[slug] = { ...next, updatedAt: Date.now() };
  else delete chapters[slug];
  save({ chapters });
}

export function recordAnswer(slug: string, questions: QuizQuestion[], index: number, choice: number) {
  update(slug, (prev) => {
    const answers = questions.map((_, i) => (i === index ? choice : (prev.answers[i] ?? null)));
    const correct = answers.filter((a, i) => a === questions[i].answer).length;
    return { ...prev, answers, correct, total: questions.length };
  });
}

export function resetQuiz(slug: string) {
  update(slug, (prev) => (prev.read ? { ...prev, answers: [], correct: 0, total: 0 } : null));
}

export function setRead(slug: string, read: boolean) {
  update(slug, (prev) => (read || prev.answers.some((a) => a !== null) ? { ...prev, read } : null));
}

export function resetAllProgress() {
  save(EMPTY);
}

export function chapterStatus(p: ChapterProgress | undefined) {
  const answered = p ? p.answers.filter((a) => a !== null).length : 0;
  const quizDone = Boolean(p && p.total > 0 && answered === p.total);
  return { answered, quizDone, done: Boolean(p?.read) || quizDone };
}
