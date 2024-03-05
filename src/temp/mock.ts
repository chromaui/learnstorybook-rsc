import { cookies, headers } from 'next/headers';
// @ts-expect-error wrong react version
import { cache } from 'react';
import { storyIndex } from './storyIndex';
import { composeStory } from './portable-stories';

const getStoryMockData = cache(() => {
  const storyId = cookies().get('__storyId__')?.value;
  console.log(`Getting mock data for '${storyId}'`);

  if (!storyId) return null;
  if (!(storyId in storyIndex)) throw new Error(`unknown storyId: '${storyId}`);

  const data = storyIndex[storyId as keyof typeof storyIndex];

  const { args } = composeStory(
    // @ts-expect-error fix types
    data.csf[data.key],
    data.csf.default,
    {},
    data.key
  );

  return args.$mock;
});

type MockData = { [key: string]: any };
const lastRequestMockDataPerSession: Record<string, MockData> = {};

const getSessionId = () => {
  const sessionId = headers().get('__storybookSessionId__');
  if (!sessionId) throw new Error('Unknown sessionId');

  return sessionId;
};

export function getLastRequestMockData(): MockData | void {
  return lastRequestMockDataPerSession[getSessionId()];
}

const getRequestMockData = cache(() => ({}) as MockData);
const setSessionMockDataKey = (key: string, data: any) => {
  const sessionId = getSessionId();

  const requestMockData = getRequestMockData();
  requestMockData[key] = data;
  lastRequestMockDataPerSession[sessionId] = requestMockData;
};

export function mockFn<TFunction extends (...args: any[]) => any>(
  original: TFunction,
  mockKey: string
) {
  return async (...args: Parameters<TFunction>) => {
    const mockData = getStoryMockData();

    if (mockData?.[mockKey]) {
      if (mockData[mockKey] instanceof Error) throw mockData[mockKey];
      return mockData[mockKey];
    }

    const data = await original(...args);
    setSessionMockDataKey(mockKey, data);
    return data;
  };
}
