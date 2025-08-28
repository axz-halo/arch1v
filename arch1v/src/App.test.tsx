import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App + MSW', () => {
  it('loads mocked Spotify track', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /load mocked track/i }))
    expect(await screen.findByTestId('track')).toHaveTextContent('Demo Track')
  })
})

