import { Task, TaskWithDescription } from '@/data/tasks';

const meta = {
  title: 'Task Page',
  parameters: { url: '/tasks/[id]' },
};

export default meta;

export const First = {
  args: {
    $url: {
      id: '1',
    },
    $mock: {
      'jsonplaceholder.typicode.com/todos': [
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
      '/lorem': {
        lorem: 'Quite a short description really',
      },
    },
  },
};

export const Last = {
  args: {
    $url: {
      id: '4',
    },
    $mock: {
      ...First.args.$mock,
      '/lorem': {
        lorem: 'Another short description',
      },
    },
  },
};

export const LastLongDescription = {
  args: {
    ...Last.args,
    $mock: {
      ...Last.args.$mock,
      '/lorem': {
        lorem:
          'An extremely long description that keeps on going and going and going and going and going and going and going and going and going and going and going and going and going',
      },
    },
  },
};
