// src/shared/todoRules.ts: today, one TS file serves both platforms // @link:shared
export const MAX_TITLE = 120; // @link:max

export function validateTitle(title: string): string | null { // @link:validate
  const trimmed = title.trim(); // @link:trim
  if (trimmed.length === 0) return 'Title is required'; // @link:empty
  if (trimmed.length > MAX_TITLE) return `Keep it under ${MAX_TITLE} characters`; // @link:long
  return null; // @link:ok
}

// In a component
const error = validateTitle(title); // @link:use
