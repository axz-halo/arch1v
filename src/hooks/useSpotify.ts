'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getCurrentTrack,
  getSpotifyProfile,
  getSpotifyPlaylists,
  getRecentlyPlayed,
  getTopTracks,
  getTrackInfo,
  getAlbumInfo,
  getArtistInfo,
  getPlaylistInfo,
  refreshSpotifyToken,
} from '@/lib/spotify';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  duration_ms: number;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  tracks: {
    total: number;
  };
  uri: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  followers: {
    total: number;
  };
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export const useSpotify = () => {
  const { profile } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyTrack[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = profile?.spotify?.accessToken;

  // 현재 재생 중인 트랙 가져오기
  const fetchCurrentTrack = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const data = await getCurrentTrack(accessToken);
      if (data?.item) {
        setCurrentTrack(data.item);
      }
    } catch (err) {
      setError('현재 재생 중인 트랙을 가져오는데 실패했습니다.');
      console.error('Error fetching current track:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // 플레이리스트 가져오기
  const fetchPlaylists = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const data = await getSpotifyPlaylists(accessToken);
      if (data?.items) {
        setPlaylists(data.items);
      }
    } catch (err) {
      setError('플레이리스트를 가져오는데 실패했습니다.');
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // 최근 재생 트랙 가져오기
  const fetchRecentlyPlayed = useCallback(async (limit: number = 20) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const data = await getRecentlyPlayed(accessToken, limit);
      if (data?.items) {
        const tracks = data.items.map((item: any) => item.track);
        setRecentlyPlayed(tracks);
      }
    } catch (err) {
      setError('최근 재생 트랙을 가져오는데 실패했습니다.');
      console.error('Error fetching recently played:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // 상위 트랙 가져오기
  const fetchTopTracks = useCallback(async (timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const data = await getTopTracks(accessToken, timeRange, limit);
      if (data?.items) {
        setTopTracks(data.items);
      }
    } catch (err) {
      setError('상위 트랙을 가져오는데 실패했습니다.');
      console.error('Error fetching top tracks:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // 트랙 정보 가져오기
  const fetchTrackInfo = useCallback(async (trackId: string) => {
    if (!accessToken) return null;

    try {
      const data = await getTrackInfo(accessToken, trackId);
      return data;
    } catch (err) {
      setError('트랙 정보를 가져오는데 실패했습니다.');
      console.error('Error fetching track info:', err);
      return null;
    }
  }, [accessToken]);

  // 앨범 정보 가져오기
  const fetchAlbumInfo = useCallback(async (albumId: string) => {
    if (!accessToken) return null;

    try {
      const data = await getAlbumInfo(accessToken, albumId);
      return data;
    } catch (err) {
      setError('앨범 정보를 가져오는데 실패했습니다.');
      console.error('Error fetching album info:', err);
      return null;
    }
  }, [accessToken]);

  // 아티스트 정보 가져오기
  const fetchArtistInfo = useCallback(async (artistId: string) => {
    if (!accessToken) return null;

    try {
      const data = await getArtistInfo(accessToken, artistId);
      return data;
    } catch (err) {
      setError('아티스트 정보를 가져오는데 실패했습니다.');
      console.error('Error fetching artist info:', err);
      return null;
    }
  }, [accessToken]);

  // 플레이리스트 정보 가져오기
  const fetchPlaylistInfo = useCallback(async (playlistId: string) => {
    if (!accessToken) return null;

    try {
      const data = await getPlaylistInfo(accessToken, playlistId);
      return data;
    } catch (err) {
      setError('플레이리스트 정보를 가져오는데 실패했습니다.');
      console.error('Error fetching playlist info:', err);
      return null;
    }
  }, [accessToken]);

  // 토큰 갱신
  const refreshToken = useCallback(async () => {
    if (!profile?.spotify?.refreshToken) return null;

    try {
      const data = await refreshSpotifyToken(profile.spotify.refreshToken);
      return data;
    } catch (err) {
      setError('토큰 갱신에 실패했습니다.');
      console.error('Error refreshing token:', err);
      return null;
    }
  }, [profile?.spotify?.refreshToken]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 주기적으로 현재 재생 중인 트랙 업데이트
  useEffect(() => {
    if (!accessToken) return;

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, [accessToken, fetchCurrentTrack]);

  return {
    currentTrack,
    playlists,
    recentlyPlayed,
    topTracks,
    loading,
    error,
    fetchCurrentTrack,
    fetchPlaylists,
    fetchRecentlyPlayed,
    fetchTopTracks,
    fetchTrackInfo,
    fetchAlbumInfo,
    fetchArtistInfo,
    fetchPlaylistInfo,
    refreshToken,
    clearError,
  };
};
