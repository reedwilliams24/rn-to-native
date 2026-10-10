import type { Chapter } from "../types";
import { components } from "./components";
import { languages } from "./languages";
import { tooling } from "./tooling";

export const CHAPTERS: Record<string, Chapter> = {
  [components.slug]: components,
  [languages.slug]: languages,
  [tooling.slug]: tooling,
};
