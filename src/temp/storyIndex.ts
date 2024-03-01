import * as inboxStories from '@/app/stories';
import * as taskStories from '@/app/tasks/[id]/stories';

export type IndexEntry = {
  title: string;
  name: string;
  csf: Record<any, any>;
  key: string;
};

export const storyIndex: Record<string, IndexEntry> = {
  'inbox--basic': {
    title: 'Inbox',
    name: 'Basic',
    csf: inboxStories,
    key: 'Basic',
  },
  'inbox--empty': {
    title: 'Inbox',
    name: 'Empty',
    csf: inboxStories,
    key: 'Empty',
  },
  'inbox--errored': {
    title: 'Inbox',
    name: 'Errored',
    csf: inboxStories,
    key: 'Errored',
  },

  'task-page--first': {
    title: 'Task Page',
    name: 'First',
    csf: taskStories,
    key: 'First',
  },
  'task-page--last': {
    title: 'Task Page',
    name: 'Last',
    csf: taskStories,
    key: 'Last',
  },
  'task-page--last-long-description': {
    title: 'Task Page',
    name: 'Last Long Description',
    csf: taskStories,
    key: 'LastLongDescription',
  },
};
