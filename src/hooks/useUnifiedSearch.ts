'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  unifiedSearch,
  extractTrackFromYouTubeUrl,
  extractTrackFromSpotifyUri,
  sortSearchResults,
  optimizeSearchQuery,
  UnifiedSearchResult,
  SearchResult,
} from '@/lib/search';

export const useUnifiedSearch = () => {
  const { profile } = useAuth();
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult>({
    tracks: [],
    playlists: [],
    videos: [],
    totalResults: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const accessToken = profile?.spotify?.accessToken;
  const youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // 통합 검색
  const search = useCallback(async (
    query: string,
    limit: number = 20
  ): Promise<UnifiedSearchResult> => {
    if (!accessToken) {
      setError('Spotify 인증이 필요합니다.');
      return searchResults;
    }

    const optimizedQuery = optimizeSearchQuery(query);
    
    if (!optimizedQuery) {
      setError('검색어를 입력해주세요.');
      return searchResults;
    }

    try {
      setLoading(true);
      setError(null);

      const results = await unifiedSearch(
        optimizedQuery,
        accessToken,
        youtubeApiKey,
        limit
      );

      // 검색 결과 정렬
      results.tracks = sortSearchResults(results.tracks);
      results.videos = sortSearchResults(results.videos);

      setSearchResults(results);

      // 검색 기록에 추가 (중복 제거)
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item !== optimizedQuery);
        return [optimizedQuery, ...filtered].slice(0, 10); // 최대 10개 유지
      });

      return results;
    } catch (err) {
      const errorMessage = '검색에 실패했습니다.';
      setError(errorMessage);
      console.error(errorMessage, err);
      return searchResults;
    } finally {
      setLoading(false);
    }
  }, [accessToken, youtubeApiKey, searchResults]);

  // YouTube URL에서 트랙 정보 추출
  const extractFromYouTubeUrl = useCallback(async (url: string): Promise<SearchResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await extractTrackFromYouTubeUrl(url, youtubeApiKey);
      return result;
    } catch (err) {
      const errorMessage = 'YouTube URL에서 트랙 정보를 추출하는데 실패했습니다.';
      setError(errorMessage);
      console.error(errorMessage, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [youtubeApiKey]);

  // Spotify URI에서 트랙 정보 추출
  const extractFromSpotifyUri = useCallback(async (uri: string): Promise<SearchResult | null> => {
    if (!accessToken) {
      setError('Spotify 인증이 필요합니다.');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await extractTrackFromSpotifyUri(uri, accessToken);
      return result;
    } catch (err) {
      const errorMessage = 'Spotify URI에서 트랙 정보를 추출하는데 실패했습니다.';
      setError(errorMessage);
      console.error(errorMessage, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // 검색 기록에서 검색
  const searchFromHistory = useCallback(async (query: string) => {
    return await search(query);
  }, [search]);

  // 검색 기록 삭제
  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory(prev => prev.filter(item => item !== query));
  }, []);

  // 검색 기록 전체 삭제
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // 검색 결과 초기화
  const clearResults = useCallback(() => {
    setSearchResults({
      tracks: [],
      playlists: [],
      videos: [],
      totalResults: 0,
      hasMore: false,
    });
  }, []);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 검색어 자동완성 (간단한 구현)
  const getSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) {
      return searchHistory.slice(0, 5);
    }

    const optimizedQuery = optimizeSearchQuery(query);
    const suggestions = searchHistory.filter(item => 
      item.toLowerCase().includes(optimizedQuery.toLowerCase())
    );

    return suggestions.slice(0, 5);
  }, [searchHistory]);

  // 인기 검색어 (하드코딩된 예시)
  const getPopularQueries = useCallback((): string[] => {
    return [
      '최신 히트곡',
      '팝송',
      'K-POP',
      '재즈',
      '클래식',
      '힙합',
      '록',
      'R&B',
      '일렉트로닉',
      '인디',
    ];
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchHistory,
    search,
    extractFromYouTubeUrl,
    extractFromSpotifyUri,
    searchFromHistory,
    removeFromHistory,
    clearHistory,
    clearResults,
    clearError,
    getSuggestions,
    getPopularQueries,
  };
};
