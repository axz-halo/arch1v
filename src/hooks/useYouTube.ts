'use client';

import { useState, useCallback } from 'react';
import {
  extractYouTubeVideoId,
  extractYouTubePlaylistId,
  getYouTubeUrlType,
  isValidYouTubeUrl,
  getYouTubeVideoInfo,
  getYouTubePlaylistInfo,
  parseYouTubeUrl,
  normalizeYouTubeUrl,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  extractYouTubeTimestamp,
  addYouTubeTimestamp,
  isYouTubeMusicUrl,
  isYouTubeShortsUrl,
  convertShortsToVideoUrl,
  parseYouTubeLink,
  YouTubeVideoInfo,
  YouTubePlaylistInfo,
} from '@/lib/youtube';

export const useYouTube = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // YouTube API 키 (환경 변수에서 가져오기)
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // YouTube URL 유효성 검사
  const validateUrl = useCallback((url: string): boolean => {
    return isValidYouTubeUrl(url);
  }, []);

  // YouTube URL 타입 확인
  const getUrlType = useCallback((url: string): 'video' | 'playlist' | 'music' | null => {
    return getYouTubeUrlType(url);
  }, []);

  // YouTube 비디오 ID 추출
  const getVideoId = useCallback((url: string): string | null => {
    return extractYouTubeVideoId(url);
  }, []);

  // YouTube 플레이리스트 ID 추출
  const getPlaylistId = useCallback((url: string): string | null => {
    return extractYouTubePlaylistId(url);
  }, []);

  // YouTube URL 정규화
  const normalizeUrl = useCallback((url: string): string | null => {
    return normalizeYouTubeUrl(url);
  }, []);

  // YouTube 임베드 URL 생성
  const getEmbedUrl = useCallback((url: string): string | null => {
    return getYouTubeEmbedUrl(url);
  }, []);

  // YouTube 썸네일 URL 생성
  const getThumbnailUrl = useCallback((videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string => {
    return getYouTubeThumbnailUrl(videoId, quality);
  }, []);

  // YouTube 시간 정보 추출
  const getTimestamp = useCallback((url: string): number | null => {
    return extractYouTubeTimestamp(url);
  }, []);

  // YouTube 시간 정보 추가
  const addTimestamp = useCallback((url: string, seconds: number): string => {
    return addYouTubeTimestamp(url, seconds);
  }, []);

  // YouTube Music URL 확인
  const isMusicUrl = useCallback((url: string): boolean => {
    return isYouTubeMusicUrl(url);
  }, []);

  // YouTube Shorts URL 확인
  const isShortsUrl = useCallback((url: string): boolean => {
    return isYouTubeShortsUrl(url);
  }, []);

  // YouTube Shorts를 일반 비디오 URL로 변환
  const convertShorts = useCallback((url: string): string | null => {
    return convertShortsToVideoUrl(url);
  }, []);

  // YouTube 비디오 정보 가져오기
  const fetchVideoInfo = useCallback(async (videoId: string): Promise<YouTubeVideoInfo | null> => {
    if (!apiKey) {
      setError('YouTube API 키가 설정되지 않았습니다.');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const videoInfo = await getYouTubeVideoInfo(videoId, apiKey);
      return videoInfo;
    } catch (err) {
      const errorMessage = 'YouTube 비디오 정보를 가져오는데 실패했습니다.';
      setError(errorMessage);
      console.error(errorMessage, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  // YouTube 플레이리스트 정보 가져오기
  const fetchPlaylistInfo = useCallback(async (playlistId: string): Promise<YouTubePlaylistInfo | null> => {
    if (!apiKey) {
      setError('YouTube API 키가 설정되지 않았습니다.');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const playlistInfo = await getYouTubePlaylistInfo(playlistId, apiKey);
      return playlistInfo;
    } catch (err) {
      const errorMessage = 'YouTube 플레이리스트 정보를 가져오는데 실패했습니다.';
      setError(errorMessage);
      console.error(errorMessage, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  // YouTube URL 파싱 (기본 정보만)
  const parseUrl = useCallback((url: string) => {
    return parseYouTubeUrl(url);
  }, []);

  // 통합 YouTube 링크 파싱
  const parseLink = useCallback(async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await parseYouTubeLink(url, apiKey);
      return result;
    } catch (err) {
      const errorMessage = 'YouTube 링크 파싱에 실패했습니다.';
      setError(errorMessage);
      console.error(errorMessage, err);
      return { type: null };
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    validateUrl,
    getUrlType,
    getVideoId,
    getPlaylistId,
    normalizeUrl,
    getEmbedUrl,
    getThumbnailUrl,
    getTimestamp,
    addTimestamp,
    isMusicUrl,
    isShortsUrl,
    convertShorts,
    fetchVideoInfo,
    fetchPlaylistInfo,
    parseUrl,
    parseLink,
    clearError,
  };
};
