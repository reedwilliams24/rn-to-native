import { PLATFORMS, type PerPlatform } from "@/content/types";
import { Inline } from "@/lib/inline";
import { PLATFORM_STYLE } from "./platform";

export function CodeCompare({
  html,
  notes,
}: {
  html: PerPlatform<string>;
  notes?: Partial<PerPlatform<string[]>>;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      {PLATFORMS.map((p) => (
        <div key={p.id} data-platform={p.id} className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-900 px-3 py-2">
            <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[p.id].dot}`} />
            <span className="text-sm font-medium text-zinc-100">{p.label}</span>
            <span className="text-xs text-zinc-400">{p.sub}</span>
          </div>
          <div
            className="code overflow-x-auto rounded-b-lg border border-zinc-800 bg-[#0d1117] text-[12.5px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html[p.id] }}
          />
          {notes?.[p.id]?.length ? (
            <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
              {notes[p.id]!.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${PLATFORM_STYLE[p.id].dot}`} />
                  <span>
                    <Inline text={n} />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
