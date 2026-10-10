import Link from "next/link";
import { OUTLINE } from "@/content/outline";
import { CHAPTERS } from "@/content/chapters";

export function Sidebar({ active }: { active?: string }) {
  return (
    <nav className="space-y-6 text-sm">
      <Link href="/" className="block">
        <div className="text-base font-semibold text-zinc-900">RN → Native</div>
        <div className="text-xs text-zinc-500">React Native to Kotlin & Swift</div>
      </Link>
      {OUTLINE.map((part) => (
        <div key={part.title}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{part.title}</div>
          <ul className="space-y-0.5">
            {part.chapters.map((c) => {
              const drafted = Boolean(CHAPTERS[c.slug]);
              const isActive = c.slug === active;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/chapters/${c.slug}`}
                    className={`flex items-baseline gap-2 rounded-md px-2 py-1.5 ${
                      isActive ? "bg-zinc-900 text-white" : drafted ? "text-zinc-900 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="w-5 shrink-0 text-right tabular-nums text-xs opacity-70">{c.number}</span>
                    <span className="flex-1">{c.title}</span>
                    {!drafted ? <span className="text-[10px] uppercase tracking-wide">planned</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
