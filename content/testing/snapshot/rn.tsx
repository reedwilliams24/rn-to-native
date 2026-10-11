import { render } from '@testing-library/react-native'; // @link:lib
import { TodoRow } from './TodoRow';

// Jest snapshots serialize the component tree to text. // @link:lib
// They catch prop and structure changes, not pixels.
test('open row', () => { // @link:open
  const { toJSON } = render(<TodoRow title="Buy milk" done={false} onToggle={() => {}} />); // @link:open-row
  expect(toJSON()).toMatchSnapshot(); // @link:snap
});

test('done row', () => { // @link:done
  const { toJSON } = render(<TodoRow title="Buy milk" done onToggle={() => {}} />); // @link:done-row
  expect(toJSON()).toMatchSnapshot(); // @link:snap
});
