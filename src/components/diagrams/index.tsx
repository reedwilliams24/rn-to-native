import type { ReactNode } from "react";
import type { DiagramId } from "@/content/types";
import { RecompositionVisualizer } from "./RecompositionVisualizer";
import { ThreadingTimeline } from "./ThreadingTimeline";

const DIAGRAMS: Record<DiagramId, () => ReactNode> = {
  recomposition: RecompositionVisualizer,
  threading: ThreadingTimeline,
};

export function Diagram({ id }: { id: DiagramId }) {
  const Component = DIAGRAMS[id];
  return <Component />;
}
