import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type BundledLanguage, type Highlighter } from "shiki";
import { PLATFORMS, type PerPlatform, type QuizQuestion } from "@/content/types";

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: ["github-dark-default"],
    langs: ["tsx", "kotlin", "swift"],
  });
  return highlighter;
}

export async function loadSnippet(chapter: string, snippet: string): Promise<PerPlatform<string>> {
  const hl = await getHighlighter();
  const entries = await Promise.all(
    PLATFORMS.map(async (p) => {
      const file = path.join(process.cwd(), "content", chapter, snippet, `${p.id}.${p.ext}`);
      const code = (await fs.readFile(file, "utf8")).trimEnd();
      return [p.id, hl.codeToHtml(code, { lang: p.lang, theme: "github-dark-default" })] as const;
    }),
  );
  return Object.fromEntries(entries) as PerPlatform<string>;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Highlighted HTML for each line of each quiz question's code (null for questions without code). */
export async function highlightQuizCode(questions: QuizQuestion[]): Promise<(string[] | null)[]> {
  const hl = await getHighlighter();
  return questions.map((q) => {
    if (q.kind !== "predict" && q.kind !== "bug") return null;
    const lang = PLATFORMS.find((p) => p.id === q.platform)!.lang as BundledLanguage;
    const { tokens } = hl.codeToTokens(q.code.trimEnd(), { lang, theme: "github-dark-default" });
    return tokens.map((line) =>
      line
        .map((t) => {
          const italic = t.fontStyle && t.fontStyle & 1 ? ";font-style:italic" : "";
          return `<span style="color:${t.color}${italic}">${escapeHtml(t.content)}</span>`;
        })
        .join(""),
    );
  });
}
