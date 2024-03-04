// Rendering a story means setting up its mocks and changing route to it

import type { NextRouter } from 'next/router';
import { StoryId, storyIndex } from './storyIndex';
import { composeStory } from '@storybook/react';

export async function renderStory(storyId: StoryId, { router }: { router: NextRouter }) {
  const entry = storyIndex[storyId];
  if (!entry) throw new Error(`Unknown storyId "${storyId}"`);

  const preparedStory = composeStory(entry.csf[entry.key], entry.csf.default, {}, entry.key);

  const { url } = preparedStory.parameters;
  if (!url) throw new Error('No URL defined on story, needs to be PSF');

  const { $url } = preparedStory.args;
  const mappedUrl = url.replace('[id]', $url?.id);

  router.push(mappedUrl);
}
