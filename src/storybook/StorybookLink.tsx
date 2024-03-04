'use client';

import React from 'react';
import type { IndexEntry, StoryId } from './storyIndex';

// This is really dumb by nextjs
export const StorybookLink = ({
  entry,
  isCurrentStory = false,
  changeStory,
}: {
  entry?: Pick<IndexEntry, 'title' | 'name'> & { id: string };
  isCurrentStory?: boolean;
  changeStory: (id: StoryId | void) => void;
}) => {
  return (
    <a
      style={{ fontWeight: isCurrentStory ? 'bold' : 'normal' }}
      onClick={() => changeStory(entry?.id)}
    >
      {entry ? `${entry.title}: ${entry.name}` : 'Reset Story'}
    </a>
  );
};
