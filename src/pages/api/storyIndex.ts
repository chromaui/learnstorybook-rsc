import type { NextApiRequest, NextApiResponse } from 'next';
import { StoryIndex, storyIndex } from '../../storybook/storyIndex';

export default function handler(req: NextApiRequest, res: NextApiResponse<StoryIndex>) {
  res.status(200).json(storyIndex);
}
