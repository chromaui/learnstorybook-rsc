export async function saveStory(formData: FormData) {
  'use server';

  const name = formData.get('name');
  const url = formData.get('url');

  if (!name || !url) {
    throw new Error('invalid form data');
  }

  const $mock = getLastRequestMockData();

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
        $mock: ${JSON.stringify($mock)},
      },
    };
  `;

  const csfFile = isIndex ? './src/app/stories.tsx' : './src/app/tasks/[id]/stories.tsx';
  const csfContents = (await readFile(csfFile)).toString('utf-8');
  await writeFile(csfFile, `${csfContents}\n\n${story}`);

  const indexEntry = `
    '${id}': {
      title: '${title}',
      name: '${name}',
      csf: ${isIndex ? 'inboxStories' : 'taskStories'},
      key: '${exportName}',
    },
  `;

  const indexFile = './src/storyIndex.ts';
  const indexContents = (await readFile(indexFile)).toString('utf8');
  const match = 'export const storyIndex: Record<string, IndexEntry> = {';
  await writeFile(indexFile, indexContents.replace(`${match}`, `${match}\n${indexEntry}`));
}
