const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';

const defaultScopes = [
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
];

export function getSpotifyAuthorizeUrl(state: string = 'arch1ve') {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
    response_type: 'code',
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/auth/spotify/callback',
    scope: defaultScopes.join(' '),
    state,
    show_dialog: 'true',
  });
  return `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`;
}
