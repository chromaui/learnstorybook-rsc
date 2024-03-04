import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { StoryIndex, type StoryId, IndexEntry } from './storyIndex';
import { StoryForm } from './StoryForm';
// import { URL } from 'url';
// import { readFile, writeFile } from 'fs/promises';
// import { revalidatePath } from 'next/cache';
import { StorybookLink } from './StorybookLink';
import { useRouter } from 'next/router';
import { renderStory } from './renderStory';
import { setupMsw } from './msw';
import { type Args, composeStory } from '@storybook/react';
import { storiesImports } from './storiesImports';
// import { cookies } from 'next/headers';

const useStoryIndex = () => {
  const [storyIndex, setStoryIndex] = useState<StoryIndex>();

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/storyIndex');
      setStoryIndex(await response.json());
    })();
  }, []);

  return storyIndex;
};

function isImportPath(importPath: string): importPath is keyof typeof storiesImports {
  return Object.keys(storiesImports).includes(importPath);
}

async function importStory(entry: IndexEntry) {
  if (!isImportPath(entry.importPath)) throw new Error(`Unexpected import ${entry.importPath}`);
  const csf = await storiesImports[entry.importPath]();

  if (!(entry.key in csf))
    throw new Error(`Didn't find key "${entry.key}" in CSF from ${entry.importPath}`);
  const story = composeStory(csf[entry.key as keyof typeof csf], csf.default, {}, entry.key);

  return story;
}

const useMsw = (getStory: () => Promise<{ args: Args } | void>) => {
  const [ready, setReady] = useState(false);
  const getStoryRef = useRef(getStory);
  getStoryRef.current = getStory;

  useEffect(() => {
    const getMockData = async () => {
      const story = await getStoryRef.current();

      return story?.args?.$mock ?? {};
    };
    setupMsw(getMockData).then(() => setReady(true));
  }, []);

  return ready;
};

export function StorybookLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const storyIndex = useStoryIndex();
  const [storyId, setStoryId] = useState<StoryId | void>();

  const getStory = useCallback(async () => {
    if (!storyId) return;

    const entry = storyIndex && storyIndex[storyId];
    if (!entry) throw new Error(`Cannot get story ${storyId}`);
    return importStory(entry);
  }, [storyIndex, storyId]);

  const changeStory = useCallback(
    async (storyId: StoryId | void) => {
      setStoryId(storyId);

      if (storyId) {
        console.log('routing to redirect route');
        router.push(`/storybook-redirect/${storyId}`);
      } else {
        router.push('/');
      }
    },
    [setStoryId, router]
  );

  const isRedirectMatch = router.pathname.match(/\/storybook-redirect\/[a-z\-]+/);
  const matchedStoryId = ([] as (string | void | false)[]).concat(
    router.pathname === '/storybook-redirect/[id]' && router.query.id
  )[0];
  useEffect(() => {
    (async () => {
      if (matchedStoryId) {
        if (storyId !== matchedStoryId) {
          setStoryId(matchedStoryId);
        } else if (storyIndex) {
          const story = await getStory();
          if (!story) throw new Error('Unexpected null story');
          await renderStory(story, { router });
        }
      }
    })();
  }, [getStory, storyIndex, storyId, matchedStoryId, router]);

  const saveStory = async () => {};

  const mswReady = useMsw(getStory);
  const ready = mswReady && !!storyIndex;

  return (
    <>
      {mswReady ? children : ''}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',

          left: '20px',
          width: '300px',
          height: '200px',
          background: '#eee',
        }}
      >
        {ready ? (
          <div>
            {Object.entries(storyIndex).map(([id, { title, name }]) => (
              <div key={id}>
                <StorybookLink
                  entry={{ id, title, name }}
                  isCurrentStory={id === storyId}
                  changeStory={changeStory}
                />
              </div>
            ))}

            <div>
              {storyId ? (
                <StorybookLink changeStory={changeStory} />
              ) : (
                <StoryForm saveStory={saveStory} />
              )}
            </div>
          </div>
        ) : (
          'Booting'
        )}
      </div>
    </>
  );
}
