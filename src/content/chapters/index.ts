import type { Chapter } from "../types";
import { components } from "./components";

export const CHAPTERS: Record<string, Chapter> = {
  [components.slug]: components,
};
