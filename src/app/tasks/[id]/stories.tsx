import { Task, TaskWithDescription } from '@/data/tasks';

const meta = {
  title: 'Task Page',
  url: '/tasks/[id]',
};

export default meta;

export const First = {
  args: {
    $url: {
      id: '1',
    },
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
    getTask: {
      id: '1',
      title: 'First Task',
      state: 'TASK_INBOX',
      description: 'Quite a short description really',
    } satisfies TaskWithDescription,
  },
};

export const Last = {
  args: {
    $url: {
      id: '4',
    },
    $mock: {
      getTasks: First.args.$mock.getTasks,
      getTask: {
        id: '4',
        title: 'Fourth Task',
        state: 'TASK_INBOX',
        description: 'Another short description',
      },
    },
  },
};

export const LastLongDescription = {
  args: {
    ...Last.args,
    $mock: {
      getTasks: Last.args.$mock.getTasks,
      getTask: {
        ...Last.args.$mock.getTask,
        description:
          'An extremely long description that keeps on going and going and going and going and going and going and going and going and going and going and going and going and going',
      },
    },
  },
};
