import { StoryObj, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TaskItem from './TaskItem';

const meta = {
  component: TaskItem,
  args: {
    onPinTask: async () => action('onPinTask')(),
    onArchiveTask: async () => action('onArchiveTask')(),
  },
} satisfies Meta<typeof TaskItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
} satisfies Story;

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
} satisfies Story;

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
} satisfies Story;

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = {
  args: {
    task: {
      ...Default.args.task,
      title: longTitleString,
    },
  },
} satisfies Story;
