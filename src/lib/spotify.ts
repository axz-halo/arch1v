// Spotify API 관련 유틸리티 함수들

// 환경에 따른 Redirect URI 결정
function getRedirectUri(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.hostname === '[::1]');
  
  if (isDevelopment && isLocalhost) {
    // 개발 환경에서는 127.0.0.1 사용 (localhost 대신)
    const port = window.location.port || '3000';
    return `http://127.0.0.1:${port}/auth/spotify/callback`;
  }
  
  // 프로덕션 환경에서는 HTTPS 사용
  return `${window.location.origin}/auth/spotify/callback`;
}

// Spotify OAuth URL 생성
export function getSpotifyAuthorizeUrl() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  
  if (!clientId) {
    throw new Error('Spotify Client ID가 설정되지 않았습니다. 환경 변수를 확인해주세요.');
  }
  
  const redirectUri = getRedirectUri();
  const scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read playlist-read-private playlist-read-collaborative streaming';
  
  // state 파라미터 추가 (CSRF 공격 방지)
  const state = generateRandomString(16);
  
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&show_dialog=true`;
}

// 랜덤 문자열 생성 (state 파라미터용)
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Spotify URI 스킴 처리
export function openSpotifyUri(uri: string) {
  // Spotify URI 형식: spotify:track:4iV5W9uYEdYUVa79Axb7Rh
  if (uri.startsWith('spotify:')) {
    // 모바일에서는 Spotify 앱으로 열기
    if (typeof window !== 'undefined' && window.navigator.userAgent.includes('Mobile')) {
      window.location.href = uri;
    } else {
      // 데스크톱에서는 Spotify Web Player로 열기
      const webUri = uri.replace('spotify:', 'https://open.spotify.com/');
      window.open(webUri, '_blank');
    }
  }
}

// Spotify 트랙 URI를 Web URL로 변환
export function spotifyUriToWebUrl(uri: string): string {
  return uri.replace('spotify:', 'https://open.spotify.com/');
}

// Spotify Web URL을 URI로 변환
export function spotifyWebUrlToUri(url: string): string {
  return url.replace('https://open.spotify.com/', 'spotify:');
}

// 현재 재생 중인 트랙 정보 가져오기
export async function getCurrentTrack(accessToken: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch current track');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching current track:', error);
    return null;
  }
}

// 사용자 프로필 정보 가져오기
export async function getSpotifyProfile(accessToken: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// 사용자 플레이리스트 가져오기
export async function getSpotifyPlaylists(accessToken: string) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return null;
  }
}

// 사용자 최근 재생 트랙 가져오기
export async function getRecentlyPlayed(accessToken: string, limit: number = 20) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recently played');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recently played:', error);
    return null;
  }
}

// 사용자 상위 트랙 가져오기
export async function getTopTracks(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return null;
  }
}

// 토큰 갱신
export async function refreshSpotifyToken(refreshToken: string) {
  try {
    const response = await fetch('/api/spotify/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Spotify URI 유효성 검사
export function isValidSpotifyUri(uri: string): boolean {
  const spotifyUriPattern = /^spotify:(track|album|artist|playlist|user):[a-zA-Z0-9]+$/;
  return spotifyUriPattern.test(uri);
}

// Spotify URI에서 타입 추출
export function getSpotifyUriType(uri: string): string | null {
  const match = uri.match(/^spotify:(track|album|artist|playlist|user):/);
  return match ? match[1] : null;
}

// Spotify URI에서 ID 추출
export function getSpotifyUriId(uri: string): string | null {
  const match = uri.match(/^spotify:(track|album|artist|playlist|user):([a-zA-Z0-9]+)$/);
  return match ? match[2] : null;
}

// 트랙 정보 가져오기
export async function getTrackInfo(accessToken: string, trackId: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch track info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching track info:', error);
    return null;
  }
}

// 앨범 정보 가져오기
export async function getAlbumInfo(accessToken: string, albumId: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch album info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching album info:', error);
    return null;
  }
}

// 아티스트 정보 가져오기
export async function getArtistInfo(accessToken: string, artistId: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch artist info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching artist info:', error);
    return null;
  }
}

// 플레이리스트 정보 가져오기
export async function getPlaylistInfo(accessToken: string, playlistId: string) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch playlist info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching playlist info:', error);
    return null;
  }
}
