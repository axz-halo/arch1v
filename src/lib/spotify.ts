// Spotify API 관련 유틸리티 함수들

// Spotify OAuth URL 생성
export function getSpotifyAuthorizeUrl() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/spotify/callback`;
  const scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read playlist-read-private playlist-read-collaborative';
  
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
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
