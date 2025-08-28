import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const workerFile = `
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
`

const outDir = resolve(__dirname, '../../public')
await writeFile(resolve(outDir, 'mockServiceWorker.js'), workerFile, 'utf8')
console.log('[msw] mockServiceWorker.js prepared in public/.')

