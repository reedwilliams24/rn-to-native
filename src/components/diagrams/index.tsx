import type { ReactNode } from "react";
import type { DiagramId } from "@/content/types";
import { LifecycleExplorer } from "./LifecycleExplorer";
import { RecompositionVisualizer } from "./RecompositionVisualizer";

const DIAGRAMS: Record<DiagramId, () => ReactNode> = {
  recomposition: RecompositionVisualizer,
  lifecycle: LifecycleExplorer,
};

export function Diagram({ id }: { id: DiagramId }) {
  const Component = DIAGRAMS[id];
  return <Component />;
}
