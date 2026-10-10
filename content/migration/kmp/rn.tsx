// src/shared/todoRules.ts: today, one TS file serves both platforms
export const MAX_TITLE = 120;

export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (trimmed.length === 0) return 'Title is required';
  if (trimmed.length > MAX_TITLE) return `Keep it under ${MAX_TITLE} characters`;
  return null;
}

// In a component
const error = validateTitle(title);
