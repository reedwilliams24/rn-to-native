import { fireEvent, render, screen } from '@testing-library/react-native'; // @link:lib
import { TodoRow } from './TodoRow';

test('tapping the row toggles it', () => { // @link:tap-test
  const onToggle = jest.fn(); // @link:counter
  render(<TodoRow title="Buy milk" done={false} onToggle={onToggle} />); // @link:render

  fireEvent.press(screen.getByText('Buy milk')); // @link:tap

  expect(onToggle).toHaveBeenCalledTimes(1); // @link:assert
});

test('a done row is checked', () => { // @link:done-test
  render(<TodoRow title="Buy milk" done onToggle={() => {}} />); // @link:done-render

  expect(screen.getByText('☑')).toBeOnTheScreen(); // @link:done-assert
});
