import "server-only";
import fs from "node:fs";
import path from "node:path";
import { CHAPTERS } from "@/content/chapters";
import { ALL_CHAPTERS } from "@/content/outline";
import { PLATFORMS, type Chapter, type PerPlatform, type Section } from "@/content/types";
import { extractLinks } from "./highlight";
import { cheatsheetRowId, type SearchEntry, type SearchIndex } from "./search";

const STOP = new Set([
  "const", "return", "func", "class", "private", "struct", "some", "true", "false", "null", "this", "self",
  "value", "values", "props", "item", "items", "string", "String", "await", "async", "import", "export",
]);

/** Identifiers inside `code spans`, e.g. "`useEffect(fn, [])`" -> ["useEffect"]. */
function identifiers(values: PerPlatform<string>) {
  const out = new Set<string>();
  for (const p of PLATFORMS) {
    for (const [, code] of values[p.id].matchAll(/`([^`]+)`/g)) {
      for (const [raw] of code.matchAll(/@?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/g)) {
        const id = raw.replace(/^\./, "");
        if (id.length >= 4 && !STOP.has(id)) out.add(id);
      }
    }
  }
  return [...out];
}

function sectionText(slug: string, s: Section) {
  const parts = [s.title, ...s.prose, s.callout ?? ""];
  for (const row of s.compare ?? []) parts.push(row.label, ...Object.values(row.values));
  for (const notes of Object.values(s.notes ?? {})) parts.push(...(notes ?? []));
  if (s.snippet) {
    for (const p of PLATFORMS) {
      const file = path.join(process.cwd(), "content", slug, s.snippet, `${p.id}.${p.ext}`);
      if (fs.existsSync(file)) parts.push(extractLinks(fs.readFileSync(file, "utf8")).code);
    }
  }
  return parts.join("\n");
}

/** Extra names for cheat-sheet rows, keyed by a pattern on the row's RN text. */
const ALIASES: [RegExp, string][] = [
  [/`navigate\(/, "navigation.navigate navigation.push push"],
  [/`goBack\(\)`/, "navigation.goBack navigation.pop pop"],
  [/`popToTop\(\)`/, "navigation.popToTop"],
  [/`reset\(/, "navigation.reset"],
  [/`route\.params`/, "useRoute"],
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Picks the section that best covers a cheat-sheet row: the one mentioning the most
 * (and rarest within the chapter) identifiers from the row. Null when nothing matches.
 */
function coveringSection(chapter: Chapter, texts: string[], values: PerPlatform<string>) {
  const ids = identifiers(values);
  const titles = chapter.sections.map((s) => s.title);
  const scores = texts.map(() => 0);
  for (const id of ids) {
    const re = new RegExp(`(?<![\\w$@])${escape(id)}(?![\\w$])`);
    const hits = texts.map((t) => re.test(t));
    const df = hits.filter(Boolean).length;
    if (df === 0 || df === texts.length) continue;
    const weight = Math.log(1 + texts.length / df);
    hits.forEach((hit, i) => {
      if (hit) scores[i] += re.test(titles[i]) ? weight * 3 : weight;
    });
  }
  let best = -1;
  scores.forEach((s, i) => {
    if (s > 0 && (best === -1 || s > scores[best])) best = i;
  });
  return best === -1 ? null : chapter.sections[best];
}

export function buildSearchIndex(): SearchIndex {
  const entries: SearchEntry[] = [];
  for (const meta of ALL_CHAPTERS) {
    const chapter = CHAPTERS[meta.slug];
    if (!chapter) continue;
    const base = { slug: meta.slug, number: meta.number, chapterTitle: meta.title };
    const texts = chapter.sections.map((s) => sectionText(meta.slug, s));

    chapter.cheatsheet.forEach((values, i) => {
      const section = coveringSection(chapter, texts, values);
      entries.push({
        kind: "cheatsheet",
        ...values,
        ...base,
        anchor: section ? section.id : cheatsheetRowId(i),
        where: section ? section.title : "Cheat sheet",
        aliases: ALIASES.filter(([re]) => re.test(values.rn)).map(([, a]) => a).join(" ") || undefined,
      });
    });

    for (const s of chapter.sections) {
      entries.push({ kind: "section", rn: s.title, android: "", ios: "", ...base, anchor: s.id, where: s.title });
    }
  }
  return { entries };
}
