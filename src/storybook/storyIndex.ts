export type StoryId = string;
export type IndexEntry = {
  title: string;
  name: string;
  key: string;
  importPath: string;
};
export type StoryIndex = Record<StoryId, IndexEntry>;

export const storyIndex: StoryIndex = {
  'inbox--basic': {
    title: 'Inbox',
    name: 'Basic',
    key: 'Basic',
    importPath: './src/storybook/stories/stories',
  },
  'inbox--empty': {
    title: 'Inbox',
    name: 'Empty',
    key: 'Empty',
    importPath: './src/storybook/stories/stories',
  },
  'inbox--errored': {
    title: 'Inbox',
    name: 'Errored',
    key: 'Errored',
    importPath: './src/storybook/stories/stories',
  },

  'task-page--first': {
    title: 'Task Page',
    name: 'First',
    key: 'First',
    importPath: './src/storybook/stories/task-stories',
  },
  'task-page--last': {
    title: 'Task Page',
    name: 'Last',
    key: 'Last',
    importPath: './src/storybook/stories/task-stories',
  },
  'task-page--last-long-description': {
    title: 'Task Page',
    name: 'Last Long Description',
    key: 'LastLongDescription',
    importPath: './src/storybook/stories/task-stories',
  },
};
