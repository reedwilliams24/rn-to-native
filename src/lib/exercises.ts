import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { Exercise, ExercisePlatform } from "@/content/types";
import { getHighlighter } from "./highlight";
import type { Cloze, CodeSegment, ExerciseData } from "./cloze";

const BLANK = /\/\*\[\*\/([\s\S]*?)\/\*\]\*\//g;
const THEME = "github-dark-default";
const LANG = { android: "kotlin", ios: "swift" } as const;

/** Strips blank markers from a solution file, returning the clean code and each blank's range. */
function parseBlanks(source: string) {
  const ranges: { start: number; end: number }[] = [];
  let code = "";
  let last = 0;
  for (const m of source.matchAll(BLANK)) {
    code += source.slice(last, m.index);
    const answer = m[1];
    if (!answer.trim() || answer.includes("\n")) throw new Error(`Blank must be non-empty and single-line: ${JSON.stringify(answer)}`);
    ranges.push({ start: code.length, end: code.length + answer.length });
    code += answer;
    last = m.index + m[0].length;
  }
  code += source.slice(last);
  return { code: code.trimEnd(), ranges };
}

/** Deterministic, so the server render and every reload show the same order. */
function shuffle(items: string[], seedText: string) {
  const out = [...items];
  let seed = 0;
  for (const ch of seedText) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
  for (let i = out.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1103515245) + 12345) | 0;
    const j = (seed >>> 8) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function loadCloze(file: string, platform: ExercisePlatform, exercise: Exercise): Promise<Cloze> {
  const { code, ranges } = parseBlanks(await fs.readFile(file, "utf8"));
  const blanks = exercise.blanks[platform];
  if (blanks.length !== ranges.length) {
    throw new Error(`${file}: ${ranges.length} blank markers but ${blanks.length} blanks configured for "${exercise.id}"`);
  }

  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code, { lang: LANG[platform], theme: THEME });
  const lines = tokens.map((line) => {
    const out: CodeSegment[] = [];
    const seen = new Set<number>();
    for (const tok of line) {
      let pos = tok.offset;
      const end = pos + tok.content.length;
      while (pos < end) {
        const inside = ranges.findIndex((r) => r.start <= pos && pos < r.end);
        if (inside !== -1) {
          if (!seen.has(inside)) out.push({ blank: inside });
          seen.add(inside);
          pos = Math.min(end, ranges[inside].end);
          continue;
        }
        const next = ranges.find((r) => r.start > pos && r.start < end);
        const stop = next ? next.start : end;
        out.push({ text: code.slice(pos, stop), color: tok.color });
        pos = stop;
      }
    }
    return out;
  });

  const answers = ranges.map((r) => code.slice(r.start, r.end));
  return {
    lines,
    answers,
    options: answers.map((a, i) => {
      const opts = [a, ...blanks[i].distractors];
      if (new Set(opts).size !== opts.length) throw new Error(`${file}: duplicate word bank option for blank ${i + 1} in "${exercise.id}"`);
      return shuffle(opts, a);
    }),
    hints: blanks.map((b) => b.hint),
    solutionHtml: hl.codeToHtml(code, { lang: LANG[platform], theme: THEME }),
  };
}

export async function loadExercise(chapter: string, exercise: Exercise): Promise<ExerciseData> {
  const dir = path.join(process.cwd(), "content", chapter, "exercises", exercise.id);
  const hl = await getHighlighter();
  const rn = (await fs.readFile(path.join(dir, "rn.tsx"), "utf8")).trimEnd();
  const [android, ios] = await Promise.all([
    loadCloze(path.join(dir, "android.kt"), "android", exercise),
    loadCloze(path.join(dir, "ios.swift"), "ios", exercise),
  ]);
  return {
    id: exercise.id,
    title: exercise.title,
    prompt: exercise.prompt,
    rnHtml: hl.codeToHtml(rn, { lang: "tsx", theme: THEME }),
    platforms: { android, ios },
  };
}
