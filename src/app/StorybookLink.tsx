'use client';

import Link from 'next/link';
import type { IndexEntry } from '@/storyIndex';

// This is really dumb by nextjs
export const StorybookLink = ({
  entry: { id, title, name },
  revalidateRoot,
}: {
  entry: Pick<IndexEntry, 'title' | 'name'> & { id: string };
  revalidateRoot: () => Promise<void>;
}) => {
  // TODO: this is a hack
  const isCurrentStory = !!document?.cookie?.match(`${id}($|;)`);

  return (
    <Link
      style={{ fontWeight: isCurrentStory ? 'bold' : 'normal' }}
      href={`/storybook-redirect/${id}`}
      onClick={() => revalidateRoot()}
    >
      {title}: {name}
    </Link>
  );
};
