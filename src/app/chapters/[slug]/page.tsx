import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { CodeCompare } from "@/components/CodeCompare";
import { CompareTable } from "@/components/CompareTable";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ALL_CHAPTERS } from "@/content/outline";
import { CHAPTERS } from "@/content/chapters";
import type { Chapter, OutlineChapter } from "@/content/types";
import { loadSnippet } from "@/lib/highlight";
import { Inline } from "@/lib/inline";

export function generateStaticParams() {
  return ALL_CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = ALL_CHAPTERS.find((c) => c.slug === slug);
  return { title: meta ? `${meta.number}. ${meta.title} · RN → Native` : "RN → Native" };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = ALL_CHAPTERS.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();
  const meta = ALL_CHAPTERS[idx];
  const chapter = CHAPTERS[slug];
  const prev = ALL_CHAPTERS[idx - 1];
  const next = ALL_CHAPTERS[idx + 1];

  return (
    <Shell active={slug}>
      {chapter ? <ChapterBody meta={meta} chapter={chapter} /> : <Planned meta={meta} />}
      <div className="mx-auto mt-20 flex max-w-[1500px] justify-between border-t border-zinc-200 pt-6 text-sm">
        {prev ? (
          <Link href={`/chapters/${prev.slug}`} className="text-zinc-600 hover:text-zinc-900">
            ← {prev.number}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/chapters/${next.slug}`} className="text-zinc-600 hover:text-zinc-900">
            {next.number}. {next.title} →
          </Link>
        ) : null}
      </div>
    </Shell>
  );
}

function Header({ meta }: { meta: OutlineChapter }) {
  return (
    <>
      <div className="text-sm font-medium text-zinc-500">Chapter {meta.number}</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">{meta.title}</h1>
    </>
  );
}

function Planned({ meta }: { meta: OutlineChapter }) {
  return (
    <div className="mx-auto max-w-3xl pt-14">
      <Header meta={meta} />
      <p className="mt-4 text-lg text-zinc-600">{meta.summary}</p>
      <div className="mt-8 rounded-lg border border-dashed border-zinc-300 p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Planned topics</div>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-zinc-700">
          {meta.topics.map((t) => (
            <li key={t}>
              <Inline text={t} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-zinc-500">This chapter hasn&apos;t been drafted yet.</p>
      </div>
    </div>
  );
}

async function ChapterBody({ meta, chapter }: { meta: OutlineChapter; chapter: Chapter }) {
  const snippets = await Promise.all(
    chapter.sections.map((s) => (s.snippet ? loadSnippet(chapter.slug, s.snippet) : Promise.resolve(null))),
  );

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="max-w-3xl pt-14">
        <Header meta={meta} />
        <div className="mt-4 space-y-4 text-lg leading-relaxed text-zinc-700">
          {chapter.intro.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </div>
        <div className="mt-8 rounded-lg bg-zinc-50 p-4 text-sm">
          <div className="font-medium text-zinc-900">In this chapter</div>
          <ol className="mt-2 grid list-decimal gap-x-8 gap-y-1 pl-5 text-zinc-600 sm:grid-cols-2">
            {chapter.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-zinc-900">
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#gotchas" className="hover:text-zinc-900">
                Gotchas
              </a>
            </li>
            <li>
              <a href="#cheatsheet" className="hover:text-zinc-900">
                Cheat sheet
              </a>
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-10">
        <PlatformFilter>
          <div className="space-y-16">
            {chapter.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-20">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  <span className="mr-2 text-zinc-300">{meta.number}.{i + 1}</span>
                  {s.title}
                </h2>
                <div className="mt-3 max-w-3xl space-y-3 leading-relaxed text-zinc-700">
                  {s.prose.map((p, j) => (
                    <p key={j}>
                      <Inline text={p} />
                    </p>
                  ))}
                </div>
                {s.compare ? (
                  <div className="mt-6">
                    <CompareTable rows={s.compare} />
                  </div>
                ) : null}
                {snippets[i] ? (
                  <div className="mt-6">
                    <CodeCompare html={snippets[i]!} notes={s.notes} />
                  </div>
                ) : null}
                {s.callout ? (
                  <div className="mt-6 max-w-4xl rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
                    <Inline text={s.callout} />
                  </div>
                ) : null}
              </section>
            ))}

            <section id="gotchas" className="scroll-mt-20">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Gotchas for RN developers</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {chapter.gotchas.map((g) => (
                  <div key={g.title} className="rounded-lg border border-zinc-200 p-4">
                    <div className="font-medium text-zinc-900">{g.title}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                      <Inline text={g.body} />
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="cheatsheet" className="scroll-mt-20">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Cheat sheet</h2>
              <div className="mt-6">
                <CompareTable rows={chapter.cheatsheet.map((values) => ({ values }))} />
              </div>
            </section>
          </div>
        </PlatformFilter>
      </div>
    </div>
  );
}
