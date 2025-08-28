import { test, expect } from '@playwright/test'

test('homepage renders and mocked track loads', async ({ page }) => {
  await page.route('https://api.spotify.com/v1/tracks/*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'demo',
        name: 'Demo Track',
        preview_url: 'https://example.com/preview.mp3',
        artists: [{ name: 'Demo Artist' }],
        album: { name: 'Demo Album' },
      }),
    })
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /vite \+ react/i })).toBeVisible()
  await page.getByRole('button', { name: /load mocked track/i }).click()
  await expect(page.getByTestId('track')).toContainText('Demo Track')
})

