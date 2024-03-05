// Rendering a story means setting up its mocks and changing route to it

import type { Args, Parameters } from '@storybook/types';
import type { NextRouter } from 'next/router';

export async function renderStory(
  { parameters, args }: { parameters: Parameters; args: Args },
  { router }: { router: NextRouter }
) {
  const { url } = parameters;
  if (!url) throw new Error('No URL defined on story, needs to be PSF');

  const { $url } = args;
  const mappedUrl = url.replace('[id]', $url?.id);

  router.push(mappedUrl);
}
