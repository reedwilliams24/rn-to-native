import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type BundledLanguage, type Highlighter } from "shiki";
import { PLATFORMS, type PerPlatform, type QuizQuestion } from "@/content/types";

let highlighter: Promise<Highlighter> | undefined;

export function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: ["github-dark-default"],
    langs: ["tsx", "kotlin", "swift"],
  });
  return highlighter;
}

// Trailing `// @link:a,b` (or `{/* @link:a,b */}` inside JSX children) ties a line to its equivalents in the other columns.
const LINK_MARKER = /\s*(?:\/\/\s*@link:([\w-]+(?:,[\w-]+)*)|\{\/\*\s*@link:([\w-]+(?:,[\w-]+)*)\s*\*\/\})\s*$/;

export function extractLinks(source: string) {
  const links: string[][] = [];
  const code = source
    .split("\n")
    .map((line, i) => {
      const m = LINK_MARKER.exec(line);
      if (!m) return line;
      links[i] = (m[1] ?? m[2]).split(",");
      return line.slice(0, m.index);
    })
    .join("\n")
    .trimEnd();
  return { code, links };
}

export async function loadSnippet(chapter: string, snippet: string): Promise<PerPlatform<string>> {
  const hl = await getHighlighter();
  const sources = await Promise.all(
    PLATFORMS.map(async (p) => {
      const file = path.join(process.cwd(), "content", chapter, snippet, `${p.id}.${p.ext}`);
      return { p, ...extractLinks(await fs.readFile(file, "utf8")) };
    }),
  );

  const columns = new Map<string, number>();
  for (const { links } of sources) {
    for (const id of new Set(links.flat())) columns.set(id, (columns.get(id) ?? 0) + 1);
  }
  const orphans = [...columns].filter(([, n]) => n < 2).map(([id]) => id);
  if (orphans.length) {
    throw new Error(`content/${chapter}/${snippet}: @link ids used in only one file: ${orphans.join(", ")}`);
  }

  const entries = sources.map(({ p, code, links }) => {
    const html = hl.codeToHtml(code, {
      lang: p.lang,
      theme: "github-dark-default",
      transformers: [
        {
          line(node, line) {
            const ids = links[line - 1];
            if (!ids) return;
            node.properties.dataLink = ids.join(" ");
            node.properties.tabIndex = 0;
          },
        },
      ],
    });
    return [p.id, html] as const;
  });
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
