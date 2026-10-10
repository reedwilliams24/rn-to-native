import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type Highlighter } from "shiki";
import { PLATFORMS, type PerPlatform } from "@/content/types";

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
