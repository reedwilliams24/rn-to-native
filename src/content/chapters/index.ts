import type { Chapter } from "../types";
import { accessibility } from "./accessibility";
import { animation } from "./animation";
import { components } from "./components";
import { nativeApis } from "./native-apis";
import { migration } from "./migration";
import { release } from "./release";
import { testing } from "./testing";
import { languages } from "./languages";
import { tooling } from "./tooling";

export const CHAPTERS: Record<string, Chapter> = {
  [components.slug]: components,
  [nativeApis.slug]: nativeApis,
  [animation.slug]: animation,
  [accessibility.slug]: accessibility,
  [testing.slug]: testing,
  [release.slug]: release,
  [migration.slug]: migration,
  [languages.slug]: languages,
  [tooling.slug]: tooling,
};
