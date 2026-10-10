import type { Chapter } from "../types";
import { components } from "./components";
import { effects } from "./effects";
import { input } from "./input";
import { layout } from "./layout";
import { lists } from "./lists";
import { navigation } from "./navigation";
import { state } from "./state";

export const CHAPTERS: Record<string, Chapter> = {
  [components.slug]: components,
  [layout.slug]: layout,
  [state.slug]: state,
  [effects.slug]: effects,
  [lists.slug]: lists,
  [input.slug]: input,
  [navigation.slug]: navigation,
};
