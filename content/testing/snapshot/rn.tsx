import { render } from '@testing-library/react-native';
import { TodoRow } from './TodoRow';

// Jest snapshots serialize the component tree to text.
// They catch prop and structure changes, not pixels.
test('open row', () => {
  const { toJSON } = render(<TodoRow title="Buy milk" done={false} onToggle={() => {}} />);
  expect(toJSON()).toMatchSnapshot();
});

test('done row', () => {
  const { toJSON } = render(<TodoRow title="Buy milk" done onToggle={() => {}} />);
  expect(toJSON()).toMatchSnapshot();
});
