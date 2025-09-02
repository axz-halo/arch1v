// 사용자 관련 타입
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  spotifyId?: string;
  createdAt: Date;
  updatedAt: Date;
  followers: number;
  following: number;
  waveCount: number;
  musicDNA?: MusicDNA;
}

// 음악 DNA (장르별 선호도)
export interface MusicDNA {
  kpop: number;
  pop: number;
  rock: number;
  hiphop: number;
  electronic: number;
  jazz: number;
  classical: number;
  indie: number;
}

// 음악 트랙 정보
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  platform: 'spotify' | 'apple' | 'youtube';
  platformId: string;
  previewUrl?: string;
  genre?: string;
}

// Wave (실시간 음악 공유)
export interface Wave {
  id: string;
  userId: string;
  user: User;
  track: Track;
  timestamp: Date;
  reactions: Reaction[];
  comments: Comment[];
  isPlaying: boolean;
}

// 반응 (좋아요, 댓글 등)
export interface Reaction {
  id: string;
  userId: string;
  waveId: string;
  type: 'like' | 'love' | 'fire';
  createdAt: Date;
}

// 댓글
export interface Comment {
  id: string;
  userId: string;
  user: User;
  waveId: string;
  content: string;
  createdAt: Date;
  reactions: Reaction[];
}

// 스테이션 (유튜브 플레이리스트)
export interface Station {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  youtubeChannelId: string;
  playlistId?: string;
  genre: string;
  subscriberCount: number;
  isSubscribed: boolean;
  currentTrack?: Track;
  queue: Track[];
}

// 차트 (커뮤니티 투표)
export interface Chart {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  tracks: ChartTrack[];
  isActive: boolean;
  winner?: ChartTrack;
}

// 차트 트랙
export interface ChartTrack {
  id: string;
  track: Track;
  submittedBy: string;
  votes: number;
  isWinner: boolean;
}

// 플레이어 상태
export interface PlayerState {
  isPlaying: boolean;
  currentTrack?: Track;
  queue: Track[];
  volume: number;
  isMuted: boolean;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
}

// 네비게이션 탭
export type TabType = 'wave' | 'station' | 'chart' | 'profile';

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션
export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total: number;
}
