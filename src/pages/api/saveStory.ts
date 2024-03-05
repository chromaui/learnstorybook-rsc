import type { NextApiRequest, NextApiResponse } from 'next';
import { readFile, writeFile } from 'fs/promises';
import { runCli, parseNr } from '@antfu/ni';
import type { MockData } from '../../storybook/msw';

export const sanitize = (string: string) => {
  return (
    string
      .toLowerCase()
      // eslint-disable-next-line no-useless-escape
      .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  );
};

let packageJson: any;

const FORMAT_COMMAND = 'workshop:format';
export const formatFile = async (file: string) => {
  if (!packageJson) {
    packageJson = JSON.parse(await readFile('./package.json', 'utf-8'));
  }
  if (packageJson.scripts[FORMAT_COMMAND]) {
    const args = `${FORMAT_COMMAND} -- ${file}`.split(' ');
    await runCli((agent, _args) => {
      return parseNr(agent, args);
    });
  }
};

export async function saveStory(name: string, url: string, mockData: MockData) {
  if (!name || !url) {
    throw new Error('invalid form data');
  }

  // TODO this code is obviously super custom
  const { pathname, searchParams } = new URL(url, 'https://whatever.com');
  const sort = searchParams.get('sort');
  const $url = {
    ...(sort && { sort }),
  };
  let title: string;
  let isIndex = false;
  if (pathname === '/') {
    title = 'Inbox';
    isIndex = true;
  } else {
    title = 'Task Page';

    // @ts-ignore
    $url.id = pathname.split('/').at(-1);
  }

  const exportName = name.toString().replace(' ', '');
  const id = `${sanitize(title)}--${sanitize(exportName)}`;

  const story = `
      export const ${exportName} = {
        args: {
          $url: ${JSON.stringify($url)},
          $mock: ${JSON.stringify(mockData)},
        },
      };
    `;

  const csfFile = isIndex
    ? './src/storybook/stories/stories.tsx'
    : './src/storybook/stories/task-stories.tsx';
  const csfContents = (await readFile(csfFile)).toString('utf-8');
  await writeFile(csfFile, `${csfContents}\n\n${story}`);
  await formatFile(csfFile);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<boolean>) {
  const { name, url, data } = req.body;

  await saveStory(name, url, data);

  res.status(200).json(true);
}
