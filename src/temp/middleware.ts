import { NextRequest, NextResponse } from 'next/server';
import { composeStory } from './portable-stories';
import { storyIndex } from './storyIndex';

const sessionIdCookieName = '__storybookSessionId__';
const storyCookieName = '__storyId__';

export function storyMiddleware(request: NextRequest) {
  const storyId = request.url.split('/').at(-1);

  if (!storyId) throw new Error('no storyId');
  if (!(storyId in storyIndex)) throw new Error(`unknown storyId: '${storyId}`);

  const data = storyIndex[storyId as keyof typeof storyIndex];

  const { args } = composeStory(
    // @ts-expect-error fix types
    data.csf[data.key],
    data.csf.default,
    {},
    data.key
  );

  // TODO compose stories doesn't handle URLs (we could use parameters temporarily?)
  const { url } = data.csf.default;

  // TODO make this bit generic
  const newUrl =
    url.replace('[id]', (args.$url?.id || '').toString()) +
    (args.$url?.sort ? `?sort=${args.$url.sort}` : '');

  const response = NextResponse.redirect(new URL(newUrl, request.url));
  response.cookies.set(storyCookieName, storyId);
  return response;
}

export function storyResetMiddleware(request: NextRequest) {
  console.log('reset middleware');
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.delete(storyCookieName);
  return response;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/storybook-redirect/')) {
    return storyMiddleware(request);
  }

  if (request.nextUrl.pathname.startsWith('/storybook-reset')) {
    return storyResetMiddleware(request);
  }

  const sessionCookie = request.cookies.get(sessionIdCookieName);
  const sessionId = sessionCookie?.value || Math.random().toString();

  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(sessionIdCookieName, sessionId);

  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  if (!sessionCookie) {
    response.cookies.set(sessionIdCookieName, sessionId);
  }
  // response.cookies.delete(storyCookieName);
  return response;
}
