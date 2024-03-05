import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { readCsf } from '@storybook/csf-tools';
import type { StoryIndex } from '../../storybook/storyIndex';

const relativePattern = /^\.{1,2}([/\\]|$)/;
/**
 * Ensures that a path starts with `./` or `../`, or is entirely `.` or `..`
 */
export function normalizeStoryPath(filename: string) {
  if (relativePattern.test(filename)) return filename;

  return `.${path.sep}${filename}`;
}

const NODE_MODULES_RE = /node_modules/;

/**
 * Exclude node_modules stories everywhere we call `glob`
 */
export const commonGlobOptions = (glob: string) =>
  NODE_MODULES_RE.test(glob) ? {} : { ignore: ['**/node_modules/**'] };

export default async function handler(req: NextApiRequest, res: NextApiResponse<StoryIndex>) {
  const workingDir = process.cwd();
  const glob = (await import('globby')).globby;
  const slash = (await import('slash')).default;

  const specifiers = ['src/storybook/stories/**/*stories.tsx'];
  const files = await Promise.all(
    specifiers.map((specifier) => glob(specifier, commonGlobOptions(specifier)))
  );

  const makeTitle = (userTitle?: string) => userTitle ?? 'FIXME';

  const index = {} as StoryIndex;
  await Promise.all(
    files.flat().map(async (file: string) => {
      const csf = (await readCsf(file, { makeTitle })).parse();
      Object.entries(csf._stories).forEach(([key, story]) => {
        index[story.id] = {
          title: csf.meta.title!,
          name: story.name!,
          key: key,
          importPath: normalizeStoryPath(slash(path.relative(workingDir, file))),
        };
      });
    })
  );

  res.status(200).json(index);
}
