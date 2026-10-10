import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function Shell({ active, children }: { active?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-zinc-200 bg-zinc-50/60 px-4 py-6 lg:block">
        <Sidebar active={active} />
      </aside>
      <main className="min-w-0 flex-1 px-6 pb-24 lg:px-10">{children}</main>
    </div>
  );
}
