// dueLabel.ts
export function dueLabel(daysLeft: number): string {
  if (daysLeft < 0) return 'Overdue';
  if (daysLeft === 0) return 'Due today';
  if (daysLeft === 1) return 'Due tomorrow';
  return `Due in ${daysLeft} days`;
}

// dueLabel.test.ts
import { dueLabel } from './dueLabel';

describe('dueLabel', () => {
  it('marks negative days as overdue', () => {
    expect(dueLabel(-2)).toBe('Overdue');
  });

  it.each([
    [0, 'Due today'],
    [1, 'Due tomorrow'],
    [3, 'Due in 3 days'],
  ])('labels %i days as %s', (days, expected) => {
    expect(dueLabel(days)).toBe(expected);
  });
});
