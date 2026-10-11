import type { ReactNode } from "react";
import type { DiagramId } from "@/content/types";
import { LifecycleExplorer } from "./LifecycleExplorer";
import { RecompositionVisualizer } from "./RecompositionVisualizer";
import { ThreadingTimeline } from "./ThreadingTimeline";

const DIAGRAMS: Record<DiagramId, () => ReactNode> = {
  recomposition: RecompositionVisualizer,
  lifecycle: LifecycleExplorer,
  threading: ThreadingTimeline,
};

export function Diagram({ id }: { id: DiagramId }) {
  const Component = DIAGRAMS[id];
  return <Component />;
}
