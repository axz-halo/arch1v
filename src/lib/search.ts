// 통합 검색 시스템 - Spotify와 YouTube 통합

import { searchSpotify } from './spotify';
import { parseYouTubeLink } from './youtube';

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  thumbnail: string;
  url: string;
  platform: 'spotify' | 'youtube';
  type: 'track' | 'video' | 'playlist';
  popularity?: number;
  previewUrl?: string;
  externalUrls?: {
    spotify?: string;
    youtube?: string;
  };
}

export interface UnifiedSearchResult {
  tracks: SearchResult[];
  playlists: SearchResult[];
  videos: SearchResult[];
  totalResults: number;
  hasMore: boolean;
}

// Spotify 검색 결과를 통합 형식으로 변환
function convertSpotifyToUnified(spotifyResults: any): SearchResult[] {
  const tracks: SearchResult[] = [];
  
  if (spotifyResults?.tracks?.items) {
    spotifyResults.tracks.items.forEach((track: any) => {
      tracks.push({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        album: track.album.name,
        duration: formatDuration(track.duration_ms),
        thumbnail: track.album.images?.[0]?.url || '',
        url: track.external_urls.spotify,
        platform: 'spotify',
        type: 'track',
        popularity: track.popularity,
        previewUrl: track.preview_url,
        externalUrls: {
          spotify: track.external_urls.spotify,
        },
      });
    });
  }
  
  return tracks;
}

// YouTube 검색 결과를 통합 형식으로 변환
function convertYouTubeToUnified(youtubeResults: any): SearchResult[] {
  const videos: SearchResult[] = [];
  
  if (youtubeResults?.items) {
    youtubeResults.items.forEach((video: any) => {
      videos.push({
        id: video.id.videoId,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        duration: video.contentDetails?.duration || '',
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || '',
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        platform: 'youtube',
        type: 'video',
        externalUrls: {
          youtube: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        },
      });
    });
  }
  
  return videos;
}

// 밀리초를 분:초 형식으로 변환
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 트랙 매칭 알고리즘 (제목, 아티스트, 길이 기반)
function calculateMatchScore(track1: SearchResult, track2: SearchResult): number {
  let score = 0;
  
  // 제목 유사도 (간단한 문자열 포함 검사)
  const title1 = track1.title.toLowerCase();
  const title2 = track2.title.toLowerCase();
  
  if (title1.includes(title2) || title2.includes(title1)) {
    score += 50;
  } else if (title1 === title2) {
    score += 100;
  }
  
  // 아티스트 유사도
  const artist1 = track1.artist.toLowerCase();
  const artist2 = track2.artist.toLowerCase();
  
  if (artist1.includes(artist2) || artist2.includes(artist1)) {
    score += 30;
  } else if (artist1 === artist2) {
    score += 60;
  }
  
  // 길이 유사도 (YouTube는 정확한 길이를 알기 어려우므로 가중치 낮음)
  if (track1.duration && track2.duration && track1.duration === track2.duration) {
    score += 20;
  }
  
  return score;
}

// 중복 트랙 제거 및 통합
function mergeDuplicateTracks(spotifyTracks: SearchResult[], youtubeVideos: SearchResult[]): SearchResult[] {
  const merged: SearchResult[] = [];
  const processedYouTubeIds = new Set<string>();
  
  // Spotify 트랙을 우선으로 처리
  spotifyTracks.forEach(spotifyTrack => {
    let bestMatch: SearchResult | null = null;
    let bestScore = 0;
    
    // YouTube 비디오와 매칭
    youtubeVideos.forEach(youtubeVideo => {
      if (processedYouTubeIds.has(youtubeVideo.id)) return;
      
      const score = calculateMatchScore(spotifyTrack, youtubeVideo);
      
      if (score > bestScore && score > 70) { // 임계값 70
        bestScore = score;
        bestMatch = youtubeVideo;
      }
    });
    
    // 매칭된 트랙 통합
    if (bestMatch) {
      merged.push({
        ...spotifyTrack,
        externalUrls: {
          spotify: spotifyTrack.externalUrls?.spotify,
          youtube: (bestMatch as SearchResult).externalUrls?.youtube,
        },
      });
      processedYouTubeIds.add((bestMatch as SearchResult).id);
    } else {
      merged.push(spotifyTrack);
    }
  });
  
  // 매칭되지 않은 YouTube 비디오 추가
  youtubeVideos.forEach(youtubeVideo => {
    if (!processedYouTubeIds.has(youtubeVideo.id)) {
      merged.push(youtubeVideo);
    }
  });
  
  return merged;
}

// 통합 검색 함수
export async function unifiedSearch(
  query: string,
  accessToken: string,
  youtubeApiKey?: string,
  limit: number = 20
): Promise<UnifiedSearchResult> {
  const results: UnifiedSearchResult = {
    tracks: [],
    playlists: [],
    videos: [],
    totalResults: 0,
    hasMore: false,
  };
  
  try {
    // Spotify 검색
    const spotifyResults = await searchSpotify(accessToken, query, ['track'], limit);
    const spotifyTracks = convertSpotifyToUnified(spotifyResults);
    
    // YouTube 검색 (API 키가 있는 경우)
    let youtubeVideos: SearchResult[] = [];
    if (youtubeApiKey) {
      try {
        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${limit}&key=${youtubeApiKey}`
        );
        
        if (youtubeResponse.ok) {
          const youtubeResults = await youtubeResponse.json();
          youtubeVideos = convertYouTubeToUnified(youtubeResults);
        }
      } catch (error) {
        console.warn('YouTube 검색 실패:', error);
      }
    }
    
    // 중복 제거 및 통합
    const mergedTracks = mergeDuplicateTracks(spotifyTracks, youtubeVideos);
    
    // 결과 분류
    results.tracks = mergedTracks.filter(item => item.type === 'track');
    results.videos = mergedTracks.filter(item => item.type === 'video');
    results.totalResults = mergedTracks.length;
    results.hasMore = mergedTracks.length >= limit;
    
  } catch (error) {
    console.error('통합 검색 실패:', error);
  }
  
  return results;
}

// YouTube URL에서 트랙 정보 추출
export async function extractTrackFromYouTubeUrl(
  url: string,
  youtubeApiKey?: string
): Promise<SearchResult | null> {
  try {
    const parsed = await parseYouTubeLink(url, youtubeApiKey);
    
    if (parsed.type === 'video' && parsed.videoInfo) {
      return {
        id: parsed.videoInfo.id,
        title: parsed.videoInfo.title,
        artist: parsed.videoInfo.artist,
        duration: parsed.videoInfo.duration,
        thumbnail: parsed.videoInfo.thumbnail,
        url: parsed.videoInfo.url,
        platform: 'youtube',
        type: 'video',
        externalUrls: {
          youtube: parsed.videoInfo.url,
        },
      };
    }
    
    return null;
  } catch (error) {
    console.error('YouTube URL에서 트랙 정보 추출 실패:', error);
    return null;
  }
}

// Spotify URI에서 트랙 정보 추출
export async function extractTrackFromSpotifyUri(
  uri: string,
  accessToken: string
): Promise<SearchResult | null> {
  try {
    const trackId = uri.replace('spotify:track:', '');
    
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const track = await response.json();
    
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      duration: formatDuration(track.duration_ms),
      thumbnail: track.album.images?.[0]?.url || '',
      url: track.external_urls.spotify,
      platform: 'spotify',
      type: 'track',
      popularity: track.popularity,
      previewUrl: track.preview_url,
      externalUrls: {
        spotify: track.external_urls.spotify,
      },
    };
  } catch (error) {
    console.error('Spotify URI에서 트랙 정보 추출 실패:', error);
    return null;
  }
}

// 검색 결과 정렬 (인기도, 매칭도 기반)
export function sortSearchResults(results: SearchResult[]): SearchResult[] {
  return results.sort((a, b) => {
    // Spotify 트랙을 우선으로
    if (a.platform === 'spotify' && b.platform !== 'spotify') {
      return -1;
    }
    if (a.platform !== 'spotify' && b.platform === 'spotify') {
      return 1;
    }
    
    // 인기도로 정렬 (Spotify만)
    if (a.popularity && b.popularity) {
      return b.popularity - a.popularity;
    }
    
    // 제목 알파벳 순
    return a.title.localeCompare(b.title);
  });
}

// 검색 쿼리 최적화
export function optimizeSearchQuery(query: string): string {
  // 불필요한 문자 제거
  let optimized = query.trim();
  
  // 특수 문자 제거 (하이픈, 괄호 등은 유지)
  optimized = optimized.replace(/[^\w\s\-\(\)]/g, '');
  
  // 연속된 공백 제거
  optimized = optimized.replace(/\s+/g, ' ');
  
  return optimized;
}
