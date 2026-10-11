export type SearchEntry = {
  kind: "cheatsheet" | "section";
  rn: string;
  android: string;
  ios: string;
  slug: string;
  number: number;
  chapterTitle: string;
  /** Element id on the chapter page */
  anchor: string;
  /** Where the anchor points: a section title, or "Cheat sheet" */
  where: string;
  /** Other names an RN dev might type for this row, space separated */
  aliases?: string;
};

export type SearchIndex = { entries: SearchEntry[] };

export function cheatsheetRowId(index: number) {
  return `cheatsheet-${index + 1}`;
}

export function entryHref(e: Pick<SearchEntry, "slug" | "anchor">) {
  return `/chapters/${e.slug}/#${e.anchor}`;
}

const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

type Prepared = { entry: SearchEntry; order: number; rn: string; code: string[]; aliases: string[]; native: string; meta: string };

const cache = new WeakMap<SearchEntry[], Prepared[]>();

function prepare(entries: SearchEntry[]) {
  let prepared = cache.get(entries);
  if (!prepared) {
    prepared = entries.map((entry, order) => ({
      entry,
      order,
      rn: compact(entry.rn),
      code: [...entry.rn.matchAll(/`([^`]+)`/g)].map((m) => compact(m[1])),
      aliases: (entry.aliases ?? "").split(/\s+/).map(compact).filter(Boolean),
      native: `${compact(entry.android)} ${compact(entry.ios)}`,
      meta: `${compact(entry.chapterTitle)} ${compact(entry.where)}`,
    }));
    cache.set(entries, prepared);
  }
  return prepared;
}

/** Length of the shortest-prefix window of `text` containing `token` as a subsequence, or -1. */
function subsequenceSpan(token: string, text: string) {
  const start = text.indexOf(token[0]);
  if (start === -1) return -1;
  let ti = 1;
  let i = start + 1;
  for (; i < text.length && ti < token.length; i++) if (text[i] === token[ti]) ti++;
  return ti === token.length ? i - start : -1;
}

function scoreToken(token: string, p: Prepared) {
  if (p.rn === token) return 110;
  const lead = p.rn.startsWith(token) ? 10 : 0;
  if (p.code.some((c) => c === token)) return 95 + lead;
  if (p.aliases.includes(token)) return 90;
  if (p.code.some((c) => c.startsWith(token))) return 85 + lead;
  if (p.rn.startsWith(token)) return 80;
  if (p.aliases.some((a) => a.startsWith(token))) return 70;
  const at = p.rn.indexOf(token);
  if (at !== -1) return 60 - Math.min(at, 20) / 2;
  if (p.native.includes(token)) return 35;
  if (p.meta.includes(token)) return 20;
  if (token.length >= 3) {
    const span = subsequenceSpan(token, p.rn);
    if (span !== -1 && span <= token.length * 3) return 5 + (token.length / span) * 10;
  }
  return 0;
}

export function search(entries: SearchEntry[], query: string, limit = 40): SearchEntry[] {
  const tokens = query.split(/\s+/).map(compact).filter(Boolean);
  if (tokens.length === 0) return [];
  const hits: { p: Prepared; score: number }[] = [];
  for (const p of prepare(entries)) {
    let score = 0;
    for (const t of tokens) {
      const s = scoreToken(t, p);
      if (s === 0) {
        score = 0;
        break;
      }
      score += s;
    }
    if (score > 0) {
      score += p.entry.kind === "cheatsheet" ? 2 : 0;
      score -= Math.min(p.rn.length, 60) / 30;
      hits.push({ p, score });
    }
  }
  hits.sort((a, b) => b.score - a.score || a.p.order - b.p.order);
  return hits.slice(0, limit).map((h) => h.p.entry);
}
