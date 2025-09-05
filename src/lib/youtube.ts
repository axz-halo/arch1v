// YouTube 링크 파싱 및 메타데이터 추출 유틸리티

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  url: string;
  type: 'video' | 'playlist';
}

export interface YouTubePlaylistInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  url: string;
}

// YouTube URL 패턴들
const YOUTUBE_PATTERNS = {
  // 일반 YouTube 비디오
  video: [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ],
  // YouTube Music
  music: [
    /music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /music\.youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
  ],
  // 플레이리스트
  playlist: [
    /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=[a-zA-Z0-9_-]+&list=([a-zA-Z0-9_-]+)/,
  ],
};

// YouTube URL에서 비디오 ID 추출
export function extractYouTubeVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS.video) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  for (const pattern of YOUTUBE_PATTERNS.music) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

// YouTube URL에서 플레이리스트 ID 추출
export function extractYouTubePlaylistId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS.playlist) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  for (const pattern of YOUTUBE_PATTERNS.music) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length > 11) {
      return match[1];
    }
  }
  
  return null;
}

// YouTube URL 타입 확인
export function getYouTubeUrlType(url: string): 'video' | 'playlist' | 'music' | null {
  if (extractYouTubeVideoId(url)) {
    return url.includes('music.youtube.com') ? 'music' : 'video';
  }
  
  if (extractYouTubePlaylistId(url)) {
    return 'playlist';
  }
  
  return null;
}

// YouTube URL 유효성 검사
export function isValidYouTubeUrl(url: string): boolean {
  return getYouTubeUrlType(url) !== null;
}

// YouTube 비디오 정보 가져오기 (YouTube Data API 사용)
export async function getYouTubeVideoInfo(videoId: string, apiKey?: string): Promise<YouTubeVideoInfo | null> {
  if (!apiKey) {
    console.warn('YouTube API key가 설정되지 않았습니다.');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 요청 실패');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;

    return {
      id: videoId,
      title: snippet.title,
      artist: snippet.channelTitle,
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
      duration: contentDetails.duration,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      type: 'video',
    };
  } catch (error) {
    console.error('YouTube 비디오 정보 가져오기 실패:', error);
    return null;
  }
}

// YouTube 플레이리스트 정보 가져오기
export async function getYouTubePlaylistInfo(playlistId: string, apiKey?: string): Promise<YouTubePlaylistInfo | null> {
  if (!apiKey) {
    console.warn('YouTube API key가 설정되지 않았습니다.');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?id=${playlistId}&part=snippet&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 요청 실패');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const playlist = data.items[0];
    const snippet = playlist.snippet;

    return {
      id: playlistId,
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
      videoCount: snippet.itemCount || 0,
      url: `https://www.youtube.com/playlist?list=${playlistId}`,
    };
  } catch (error) {
    console.error('YouTube 플레이리스트 정보 가져오기 실패:', error);
    return null;
  }
}

// YouTube URL에서 메타데이터 추출 (API 없이 기본 정보만)
export function parseYouTubeUrl(url: string): Partial<YouTubeVideoInfo> | null {
  const videoId = extractYouTubeVideoId(url);
  const playlistId = extractYouTubePlaylistId(url);
  const urlType = getYouTubeUrlType(url);

  if (!videoId && !playlistId) {
    return null;
  }

  if (videoId) {
    return {
      id: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      type: 'video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  if (playlistId) {
    return {
      id: playlistId,
      url: `https://www.youtube.com/playlist?list=${playlistId}`,
      type: 'playlist',
    };
  }

  return null;
}

// YouTube URL을 표준 형식으로 정규화
export function normalizeYouTubeUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  const playlistId = extractYouTubePlaylistId(url);

  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  if (playlistId) {
    return `https://www.youtube.com/playlist?list=${playlistId}`;
  }

  return null;
}

// YouTube 임베드 URL 생성
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

// YouTube 썸네일 URL 생성
export function getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

// YouTube URL에서 시간 정보 추출 (예: &t=1m30s)
export function extractYouTubeTimestamp(url: string): number | null {
  const timeMatch = url.match(/[?&]t=(\d+)([ms]?)/);
  
  if (!timeMatch) {
    return null;
  }

  const value = parseInt(timeMatch[1]);
  const unit = timeMatch[2];

  if (unit === 'm') {
    return value * 60; // 분을 초로 변환
  } else if (unit === 's') {
    return value;
  } else {
    return value; // 단위가 없으면 초로 가정
  }
}

// YouTube URL에서 시간 정보를 포함한 URL 생성
export function addYouTubeTimestamp(url: string, seconds: number): string {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return url;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `https://www.youtube.com/watch?v=${videoId}&t=${minutes}m${remainingSeconds}s`;
  } else {
    return `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`;
  }
}

// YouTube Music URL인지 확인
export function isYouTubeMusicUrl(url: string): boolean {
  return url.includes('music.youtube.com');
}

// YouTube Shorts URL인지 확인
export function isYouTubeShortsUrl(url: string): boolean {
  return url.includes('youtube.com/shorts/');
}

// YouTube Shorts URL을 일반 비디오 URL로 변환
export function convertShortsToVideoUrl(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  
  if (!shortsMatch) {
    return null;
  }

  const videoId = shortsMatch[1];
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// 통합 YouTube URL 파싱 함수
export async function parseYouTubeLink(
  url: string, 
  apiKey?: string
): Promise<{
  type: 'video' | 'playlist' | 'music' | null;
  videoInfo?: YouTubeVideoInfo;
  playlistInfo?: YouTubePlaylistInfo;
  basicInfo?: Partial<YouTubeVideoInfo>;
}> {
  const urlType = getYouTubeUrlType(url);
  
  if (!urlType) {
    return { type: null };
  }

  const basicInfo = parseYouTubeUrl(url);

  if (urlType === 'video' || urlType === 'music') {
    const videoId = extractYouTubeVideoId(url);
    
    if (!videoId) {
      return { type: urlType, basicInfo: basicInfo || undefined };
    }

    const videoInfo = await getYouTubeVideoInfo(videoId, apiKey);
    
    return {
      type: urlType,
      videoInfo: videoInfo || undefined,
      basicInfo: basicInfo || undefined,
    };
  }

  if (urlType === 'playlist') {
    const playlistId = extractYouTubePlaylistId(url);
    
    if (!playlistId) {
      return { type: urlType, basicInfo: basicInfo || undefined };
    }

    const playlistInfo = await getYouTubePlaylistInfo(playlistId, apiKey);
    
    return {
      type: urlType,
      playlistInfo: playlistInfo || undefined,
      basicInfo: basicInfo || undefined,
    };
  }

  return { type: urlType, basicInfo: basicInfo || undefined };
}
