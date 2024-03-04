import { setupWorker } from 'msw/browser'; // TODO also import from msw/node
import { bypass, http, HttpResponse, passthrough } from 'msw';

type MockData = Record<string, any>;

export async function setupMsw(getMockData: () => Promise<MockData>) {
  if (typeof window !== 'undefined') {
    console.log('setting up worker');
    console.log(setupWorker);

    // This is a bit of a hack because msw's bypass seems broken
    // Also it doesn't work if you make >1 request to the same URL
    const passingThrough = new Set();

    const worker = setupWorker(
      http.get('*', async ({ request }) => {
        // TODO : this seems to happen on HMR, not sure what's correct
        if (!request) {
          return passthrough();
        }

        // console.log('intercepting', request.url, passingThrough.keys());

        // FIXME: always allow JS requests through. Otherwise we block the request that
        // actually import's the story's JS file in order to find out if we should mock that request
        // which is an unsolvable loop.
        // We probably need to refactor this a bit to avoid this problem
        const isJsRequest = request.url.endsWith('.js');
        if (isJsRequest || passingThrough.has(request.url)) {
          return passthrough();
        }

        const mockData = await getMockData();
        const matching = Object.entries(mockData).find(([key]) =>
          request.url.match(new RegExp(key))
        );
        console.log({ url: request.url, matching, keys: Object.keys(mockData) });

        if (matching) {
          if (matching[1] instanceof Error) {
            return HttpResponse.text(matching[1].message, { status: 500 });
          }
          return HttpResponse.json(matching[1]);
        }

        passingThrough.add(request.url);
        const response = await fetch(request);
        passingThrough.delete(request.url);

        if (response.headers.get('content-type')?.indexOf('application/json') !== -1) {
          const json = await response.json();

          return HttpResponse.json(json);
        } else {
          return response;
        }
      })
    );

    return worker.start();
  }
}