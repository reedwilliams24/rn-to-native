import { Fragment, type ReactNode } from "react";

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function Inline({ text }: { text: string }): ReactNode {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code key={i} className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.85em] text-zinc-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
