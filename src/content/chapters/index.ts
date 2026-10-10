import type { Chapter } from "../types";
import { accessibility } from "./accessibility";
import { animation } from "./animation";
import { components } from "./components";
import { nativeApis } from "./native-apis";

export const CHAPTERS: Record<string, Chapter> = {
  [components.slug]: components,
  [nativeApis.slug]: nativeApis,
  [animation.slug]: animation,
  [accessibility.slug]: accessibility,
};
