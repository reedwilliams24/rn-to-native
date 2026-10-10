import { fireEvent, render, screen } from '@testing-library/react-native';
import { TodoRow } from './TodoRow';

test('tapping the row toggles it', () => {
  const onToggle = jest.fn();
  render(<TodoRow title="Buy milk" done={false} onToggle={onToggle} />);

  fireEvent.press(screen.getByText('Buy milk'));

  expect(onToggle).toHaveBeenCalledTimes(1);
});

test('a done row is checked', () => {
  render(<TodoRow title="Buy milk" done onToggle={() => {}} />);

  expect(screen.getByText('☑')).toBeOnTheScreen();
});
