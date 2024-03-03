import { Task } from '@/data/tasks';

const meta = {
  title: 'Inbox',
  url: '/',
};

export default meta;

export const Basic = {
  args: {
    $mock: {
      getTasks: [
        {
          id: '1',
          title: 'First Task',
          state: 'TASK_INBOX',
        },
        {
          id: '2',
          title: 'Second Task',
          state: 'TASK_PINNED',
        },
        {
          id: '3',
          title: 'Third Task',
          state: 'TASK_ARCHIVED',
        },
        {
          id: '4',
          title: 'Fourth Task',
          state: 'TASK_INBOX',
        },
      ] satisfies Task[],
    },
  },
};

export const Empty = {
  args: {
    $mock: {
      getTasks: [] satisfies Task[],
    },
  },
};

export const Errored = {
  args: {
    $mock: {
      getTasks: new Error('Fetching tasks failed'),
    },
  },
};
