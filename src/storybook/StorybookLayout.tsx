import React, { useCallback, useEffect, useRef, useState } from 'react';

import { StoryId, storyIndex } from './storyIndex';
// import { getLastRequestMockData } from '../mock';
import { StoryForm } from './StoryForm';
// import { URL } from 'url';
// import { readFile, writeFile } from 'fs/promises';
// import { revalidatePath } from 'next/cache';
import { StorybookLink } from './StorybookLink';
import { useRouter } from 'next/router';
import { renderStory } from './renderStory';
import { setupMsw } from './msx';
import { composeStory } from '@storybook/react';
// import { cookies } from 'next/headers';

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

const useMsw = (storyId: StoryId | void) => {
  const [ready, setReady] = useState(false);
  const storyIdRef = useRef(storyId);
  storyIdRef.current = storyId;

  useEffect(() => {
    const getMockData = () => {
      if (!storyIdRef.current) return {};

      console.log(`getting mock data for ${storyIdRef.current}`);
      const entry = storyIndex[storyIdRef.current];
      if (!entry) throw new Error(`Unknown storyId "${storyIdRef.current}"`);

      const { args } = composeStory(entry.csf[entry.key], entry.csf.default, {}, entry.key);

      console.log(args);
      return args.$mock;
    };
    setupMsw(getMockData).then(() => setReady(true));
  }, []);

  return ready;
};

export function StorybookLayout({ children }) {
  const router = useRouter();
  const [storyId, setStoryId] = useState<StoryId | void>();

  const changeStory = useCallback(
    async (storyId: StoryId | void) => {
      setStoryId(storyId);

      if (storyId) {
        console.log('routing to redirect route');
        router.push('/storybook-redirect');
      } else {
        router.push('/');
      }
    },
    [setStoryId, router]
  );

  const isRedirect = router.pathname === '/storybook-redirect';
  useEffect(() => {
    (async () => {
      if (isRedirect && storyId) {
        console.log('routing to story');
        await renderStory(storyId, { router });
      }
    })();
  }, [storyId, isRedirect]);

  const saveStory = async () => {};

  const mswReady = useMsw(storyId);

  // const currentStoryId = cookies().get('__storyId__')?.value;

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
        {mswReady ? (
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
