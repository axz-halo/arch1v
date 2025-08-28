import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://api.spotify.com/v1/tracks/:id', () => {
    return HttpResponse.json({
      id: 'demo',
      name: 'Demo Track',
      preview_url: 'https://example.com/preview.mp3',
      artists: [{ name: 'Demo Artist' }],
      album: { name: 'Demo Album' },
    })
  }),
]

export const server = setupServer(...handlers)

