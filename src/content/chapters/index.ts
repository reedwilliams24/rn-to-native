import type { Chapter } from "../types";
import { architecture } from "./architecture";
import { async } from "./async";
import { components } from "./components";
import { networking } from "./networking";
import { persistence } from "./persistence";

export const CHAPTERS: Record<string, Chapter> = {
  [components.slug]: components,
  [architecture.slug]: architecture,
  [async.slug]: async,
  [networking.slug]: networking,
  [persistence.slug]: persistence,
};
