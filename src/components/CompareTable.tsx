import { PLATFORMS, type PerPlatform } from "@/content/types";
import { Inline } from "@/lib/inline";
import { PLATFORM_STYLE } from "./platform";

export function CompareTable({
  rows,
  rowLabel,
}: {
  rows: { label?: string; values: PerPlatform<string> }[];
  rowLabel?: string;
}) {
  const hasLabel = rows.some((r) => r.label);
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-zinc-700">
          <tr>
            {hasLabel ? <th className="w-44 px-4 py-2.5 font-medium">{rowLabel ?? ""}</th> : null}
            {PLATFORMS.map((p) => (
              <th key={p.id} data-platform={p.id} className="px-4 py-2.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${PLATFORM_STYLE[p.id].dot}`} />
                  {p.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {hasLabel ? <td className="px-4 py-2.5 font-medium text-zinc-900">{r.label}</td> : null}
              {PLATFORMS.map((p) => (
                <td key={p.id} data-platform={p.id} className="px-4 py-2.5 text-zinc-700">
                  <Inline text={r.values[p.id]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
