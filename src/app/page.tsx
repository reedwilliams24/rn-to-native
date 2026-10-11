import Link from "next/link";
import { Shell } from "@/components/Shell";
import { ALL_CHAPTERS, OUTLINE } from "@/content/outline";
import { ProgressBadge } from "@/components/ProgressBadge";
import { ProgressSummary } from "@/components/ProgressSummary";
import { CHAPTERS } from "@/content/chapters";
import { PLATFORMS } from "@/content/types";
import { PLATFORM_STYLE } from "@/components/platform";

export default function Home() {
  return (
    <Shell>
      <div className="mx-auto max-w-5xl pt-14">
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <span key={p.id} className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600">
              <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[p.id].dot}`} />
              {p.label}
            </span>
          ))}
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">React Native → Native</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-600">
          A side-by-side guide for React Native engineers learning Kotlin with Jetpack Compose, and Swift with SwiftUI.
          Every concept is shown in all three, next to each other, with notes on what actually differs and the gotchas
          that trip up RN developers.
        </p>
        <ProgressSummary
          chapters={ALL_CHAPTERS.filter((c) => CHAPTERS[c.slug]).map(({ slug, number, title }) => ({ slug, number, title }))}
        />

        <h2 className="mt-16 text-xl font-semibold text-zinc-900">Outline</h2>
        <div className="mt-6 space-y-10">
          {OUTLINE.map((part) => (
            <section key={part.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{part.title}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {part.chapters.map((c) => {
                  const drafted = Boolean(CHAPTERS[c.slug]);
                  return (
                    <Link
                      key={c.slug}
                      href={`/chapters/${c.slug}`}
                      className="group rounded-lg border border-zinc-200 p-4 hover:border-zinc-400"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="font-medium text-zinc-900">
                          <span className="mr-2 tabular-nums text-zinc-400">{c.number}</span>
                          {c.title}
                        </div>
                        {drafted ? (
                          <ProgressBadge
                            slug={c.slug}
                            fallback={
                              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
                                Draft
                              </span>
                            }
                          />
                        ) : (
                          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                            Planned
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-600">{c.summary}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Shell>
  );
}
