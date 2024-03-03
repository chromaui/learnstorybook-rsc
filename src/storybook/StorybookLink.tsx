'use client';

import React from 'react';
import Link from 'next/link';
import type { IndexEntry } from './storyIndex';

// This is really dumb by nextjs
export const StorybookLink = ({
  entry,
  isCurrentStory = false,
  revalidateRoot,
}: {
  entry?: Pick<IndexEntry, 'title' | 'name'> & { id: string };
  isCurrentStory?: boolean;
  revalidateRoot: () => Promise<void>;
}) => {
  return (
    <Link
      style={{ fontWeight: isCurrentStory ? 'bold' : 'normal' }}
      href={entry ? `/storybook-redirect/${entry.id}` : '/storybook-reset'}
      onClick={() => revalidateRoot()}
    >
      {entry ? `${entry.title}: ${entry.name}` : 'Reset Story'}
    </Link>
  );
};
