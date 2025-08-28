
/*
  This file registers MSW in the browser for dev and Playwright.
*/
import { setupWorker, http, HttpResponse } from 'msw'

export const worker = setupWorker(
  http.get('https://api.spotify.com/v1/tracks/:id', () => {
    return HttpResponse.json({
      id: 'demo',
      name: 'Demo Track',
      preview_url: 'https://example.com/preview.mp3',
      artists: [{ name: 'Demo Artist' }],
      album: { name: 'Demo Album' },
    })
  }),
)

worker.start({ onUnhandledRequest: 'bypass' })
