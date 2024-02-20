import { StoryObj, Meta } from '@storybook/react';

import TaskList from './TaskList';
import * as TaskItemStories from './TaskItem.stories';

const meta = {
  component: TaskList,
  decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],

  args: {
    tasks: [
      { ...TaskItemStories.Default.args.task, id: '1', title: 'Task 1' },
      { ...TaskItemStories.Default.args.task, id: '2', title: 'Task 2' },
      { ...TaskItemStories.Default.args.task, id: '3', title: 'Task 3' },
      { ...TaskItemStories.Default.args.task, id: '4', title: 'Task 4' },
      { ...TaskItemStories.Default.args.task, id: '5', title: 'Task 5' },
      { ...TaskItemStories.Default.args.task, id: '6', title: 'Task 6' },
    ],
  },
} satisfies Meta<typeof TaskList>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithPinnedTasks = {
  args: {
    tasks: [
      ...meta.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
} satisfies Story;

export const Empty = {
  args: {
    tasks: [],
  },
} satisfies Story;
