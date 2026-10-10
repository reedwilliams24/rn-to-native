import type { Chapter } from "../types";
import { components } from "./components";
import { migration } from "./migration";
import { release } from "./release";
import { testing } from "./testing";
import { languages } from "./languages";
import { tooling } from "./tooling";

export const CHAPTERS: Record<string, Chapter> = {
  [components.slug]: components,
  [testing.slug]: testing,
  [release.slug]: release,
  [migration.slug]: migration,
  [languages.slug]: languages,
  [tooling.slug]: tooling,
};
