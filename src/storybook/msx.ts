import { setupWorker } from 'msw/browser'; // TODO also import from msw/node
import { bypass, http, HttpResponse, passthrough } from 'msw';

type MockData = Record<string, any>;

export async function setupMsw(getMockData: () => MockData) {
  if (typeof window !== 'undefined') {
    console.log('setting up worker');
    console.log(setupWorker);

    // This is a bit of a hack because msw's bypass seems broken
    // Also it doesn't work if you make >1 request to the same URL
    const passingThrough = new Set();

    const worker = setupWorker(
      http.get('*', async ({ request }) => {
        console.log('intercepting', request.url);
        if (passingThrough.has(request.url)) {
          return passthrough();
        }

        const mockData = getMockData();
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
