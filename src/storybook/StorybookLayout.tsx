import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { StoryIndex, type StoryId, IndexEntry } from './storyIndex';
import { StoryForm } from './StoryForm';
import { StorybookLink } from './StorybookLink';
import { useRouter } from 'next/router';
import { renderStory } from './renderStory';
import { MockData, setupMsw } from './msw';
import { type Args, composeStory } from '@storybook/react';
import { storiesImports } from './storiesImports';

// Should we hard redirect you when you click on a story (to reset browser state)?
// We'll probably make this default to true but allow it to be disabled (and use a soft redirect)
// if the user takes care of resetting all browser state s
const HARD_REDIRECT = true;

const useStoryIndex = () => {
  const [storyIndex, setStoryIndex] = useState<StoryIndex>();
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    (async () => {
      if (shouldFetch) {
        const response = await fetch('/api/storyIndex');
        setStoryIndex(await response.json());
        setShouldFetch(false);
      }
    })();
  }, [shouldFetch, setShouldFetch]);

  return [storyIndex, () => setShouldFetch(true)] as const;
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
  const [getSavedData, setGetSavedData] = useState<() => MockData>();
  const getStoryRef = useRef(getStory);
  getStoryRef.current = getStory;

  useEffect(() => {
    const getMockData = async () => {
      const story = await getStoryRef.current();

      return story?.args?.$mock ?? {};
    };
    setupMsw(getMockData).then((f) => setGetSavedData((_) => f));
  }, []);

  return getSavedData;
};

export function StorybookLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [storyIndex, refetchStoryIndex] = useStoryIndex();
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

      let url: string;
      if (storyId) {
        url = `/storybook-redirect/${storyId}`;
      } else {
        url = '/';
      }
      if (HARD_REDIRECT) {
        document.location = url;
      } else {
        router.push(url);
      }
    },
    [setStoryId, router]
  );

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

  const getSavedData = useMsw(getStory);
  const ready = !!getSavedData && !!storyIndex;

  const [saving, setSaving] = useState(false);

  const saveStory = async (name: string, url: string, data: MockData) => {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    await fetch('/api/saveStory', {
      method: 'POST',
      body: JSON.stringify({ name, url, data }),
      headers,
    });
    setSaving(false);
    refetchStoryIndex();
  };

  return (
    <>
      {getSavedData ? children : ''}
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
        {storyId ? (
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              border: '3px dashed green',
              pointerEvents: 'none',
            }}
          />
        ) : (
          ''
        )}
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
                <button onClick={() => setSaving(true)}>Save Story</button>
              )}
            </div>
          </div>
        ) : (
          'Booting'
        )}
      </div>
      {ready && saving ? (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginTop: '-300px',
            marginLeft: '-300px',
            width: '600px',
            maxHeight: '600px',
            overflow: 'scroll',
            background: '#eee',
          }}
        >
          <StoryForm savedData={getSavedData()} saveStory={saveStory} />
        </div>
      ) : (
        ''
      )}
    </>
  );
}
