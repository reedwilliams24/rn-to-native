// dueLabel.ts // @link:file
export function dueLabel(daysLeft: number): string { // @link:fn
  if (daysLeft < 0) return 'Overdue'; // @link:overdue
  if (daysLeft === 0) return 'Due today'; // @link:today
  if (daysLeft === 1) return 'Due tomorrow'; // @link:tomorrow
  return `Due in ${daysLeft} days`; // @link:later
}

// dueLabel.test.ts // @link:testfile
import { dueLabel } from './dueLabel';

describe('dueLabel', () => { // @link:suite
  it('marks negative days as overdue', () => { // @link:neg-test
    expect(dueLabel(-2)).toBe('Overdue'); // @link:neg-assert
  });

  it.each([ // @link:table
    [0, 'Due today'], // @link:table
    [1, 'Due tomorrow'],
    [3, 'Due in 3 days'],
  ])('labels %i days as %s', (days, expected) => { // @link:table
    expect(dueLabel(days)).toBe(expected); // @link:table-assert
  });
});
