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
  searchSpotify,
  playTrack,
  pausePlayback,
  skipToNext,
  skipToPrevious,
  setVolume,
  getAvailableDevices,
  addTrackToPlaylist,
  saveTrack,
  removeTrack,
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
  const [searchResults, setSearchResults] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
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

  // Spotify 검색
  const searchTracks = useCallback(async (query: string, types: string[] = ['track'], limit: number = 20) => {
    if (!accessToken) return null;

    try {
      setLoading(true);
      const data = await searchSpotify(accessToken, query, types, limit);
      setSearchResults(data);
      return data;
    } catch (err) {
      setError('검색에 실패했습니다.');
      console.error('Error searching:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // 재생 제어 함수들
  const playTrackById = useCallback(async (trackUri: string, deviceId?: string) => {
    if (!accessToken) return false;

    try {
      const success = await playTrack(accessToken, trackUri, deviceId);
      if (success) {
        setIsPlaying(true);
        await fetchCurrentTrack(); // 현재 재생 중인 트랙 업데이트
      }
      return success;
    } catch (err) {
      setError('재생에 실패했습니다.');
      console.error('Error playing track:', err);
      return false;
    }
  }, [accessToken, fetchCurrentTrack]);

  const pauseCurrentTrack = useCallback(async (deviceId?: string) => {
    if (!accessToken) return false;

    try {
      const success = await pausePlayback(accessToken, deviceId);
      if (success) {
        setIsPlaying(false);
      }
      return success;
    } catch (err) {
      setError('일시정지에 실패했습니다.');
      console.error('Error pausing:', err);
      return false;
    }
  }, [accessToken]);

  const skipNext = useCallback(async (deviceId?: string) => {
    if (!accessToken) return false;

    try {
      const success = await skipToNext(accessToken, deviceId);
      if (success) {
        await fetchCurrentTrack(); // 현재 재생 중인 트랙 업데이트
      }
      return success;
    } catch (err) {
      setError('다음 트랙으로 이동에 실패했습니다.');
      console.error('Error skipping next:', err);
      return false;
    }
  }, [accessToken, fetchCurrentTrack]);

  const skipPrevious = useCallback(async (deviceId?: string) => {
    if (!accessToken) return false;

    try {
      const success = await skipToPrevious(accessToken, deviceId);
      if (success) {
        await fetchCurrentTrack(); // 현재 재생 중인 트랙 업데이트
      }
      return success;
    } catch (err) {
      setError('이전 트랙으로 이동에 실패했습니다.');
      console.error('Error skipping previous:', err);
      return false;
    }
  }, [accessToken, fetchCurrentTrack]);

  const changeVolume = useCallback(async (volumePercent: number, deviceId?: string) => {
    if (!accessToken) return false;

    try {
      return await setVolume(accessToken, volumePercent, deviceId);
    } catch (err) {
      setError('볼륨 조절에 실패했습니다.');
      console.error('Error setting volume:', err);
      return false;
    }
  }, [accessToken]);

  // 디바이스 목록 가져오기
  const fetchDevices = useCallback(async () => {
    if (!accessToken) return;

    try {
      const data = await getAvailableDevices(accessToken);
      if (data?.devices) {
        setDevices(data.devices);
      }
    } catch (err) {
      setError('디바이스 목록을 가져오는데 실패했습니다.');
      console.error('Error fetching devices:', err);
    }
  }, [accessToken]);

  // 플레이리스트에 트랙 추가
  const addToPlaylist = useCallback(async (playlistId: string, trackUri: string) => {
    if (!accessToken) return false;

    try {
      const result = await addTrackToPlaylist(accessToken, playlistId, trackUri);
      return !!result;
    } catch (err) {
      setError('플레이리스트에 트랙 추가에 실패했습니다.');
      console.error('Error adding track to playlist:', err);
      return false;
    }
  }, [accessToken]);

  // 라이브러리에 트랙 저장/제거
  const saveTrackToLibrary = useCallback(async (trackId: string) => {
    if (!accessToken) return false;

    try {
      return await saveTrack(accessToken, trackId);
    } catch (err) {
      setError('라이브러리에 저장에 실패했습니다.');
      console.error('Error saving track:', err);
      return false;
    }
  }, [accessToken]);

  const removeTrackFromLibrary = useCallback(async (trackId: string) => {
    if (!accessToken) return false;

    try {
      return await removeTrack(accessToken, trackId);
    } catch (err) {
      setError('라이브러리에서 제거에 실패했습니다.');
      console.error('Error removing track:', err);
      return false;
    }
  }, [accessToken]);

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
    searchResults,
    devices,
    isPlaying,
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
    searchTracks,
    playTrackById,
    pauseCurrentTrack,
    skipNext,
    skipPrevious,
    changeVolume,
    fetchDevices,
    addToPlaylist,
    saveTrackToLibrary,
    removeTrackFromLibrary,
    clearError,
  };
};
