import type { ReactNode } from "react";
import type { DiagramId } from "@/content/types";
import { RecompositionVisualizer } from "./RecompositionVisualizer";

const DIAGRAMS: Record<DiagramId, () => ReactNode> = {
  recomposition: RecompositionVisualizer,
};

export function Diagram({ id }: { id: DiagramId }) {
  const Component = DIAGRAMS[id];
  return <Component />;
}
