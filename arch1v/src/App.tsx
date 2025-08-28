import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function SpotifyPreview() {
  const [trackName, setTrackName] = useState<string>('')
  async function load() {
    const res = await fetch('https://api.spotify.com/v1/tracks/any')
    const data = await res.json()
    setTrackName(`${data.name} – ${data.artists?.[0]?.name ?? ''}`)
  }
  return (
    <div>
      <button onClick={load}>Load Mocked Track</button>
      {trackName && <p data-testid="track">{trackName}</p>}
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <SpotifyPreview />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
