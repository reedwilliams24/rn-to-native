// Closest RN equivalent: a Storybook story (CSF3)
import type { Meta, StoryObj } from '@storybook/react-native';
import { TodoRow } from './TodoRow';

const meta: Meta<typeof TodoRow> = { component: TodoRow };
export default meta;

export const Open: StoryObj<typeof TodoRow> = { // @link:open
  args: { title: 'Buy milk', done: false, onToggle: () => {} }, // @link:open-args
};

export const Done: StoryObj<typeof TodoRow> = { // @link:done
  args: { title: 'Buy milk', done: true, onToggle: () => {} }, // @link:done-args
};
