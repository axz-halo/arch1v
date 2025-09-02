'use client';

import React, { useState, useMemo } from 'react';
import { Station } from '@/types';
import { mockStations } from '@/lib/mockData';
import StationCard from './StationCard';
import { Filter, Search } from 'lucide-react';

interface StationFeedProps {
  onStationSelect?: (station: Station) => void;
}

const StationFeed: React.FC<StationFeedProps> = ({ onStationSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);

  // 장르 목록
  const genres = useMemo(() => {
    const genreSet = new Set(mockStations.map(station => station.genre));
    return ['all', ...Array.from(genreSet)];
  }, []);

  // 필터링된 스테이션
  const filteredStations = useMemo(() => {
    return mockStations.filter(station => {
      const matchesGenre = selectedGenre === 'all' || station.genre === selectedGenre;
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           station.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubscription = !showSubscribedOnly || station.isSubscribed;
      
      return matchesGenre && matchesSearch && matchesSubscription;
    });
  }, [selectedGenre, searchQuery, showSubscribedOnly]);

  const handlePlay = (station: Station) => {
    // 실제로는 스테이션 재생 로직
    console.log('Playing station:', station.name);
  };

  const handleSubscribe = (station: Station) => {
    // 실제로는 구독/구독 해제 API 호출
    console.log('Toggle subscription for:', station.name);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">스테이션</h1>
        
        {/* 검색바 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="스테이션 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200 outline-none"
          />
        </div>

        {/* 필터 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">필터:</span>
          </div>
          
          {/* 장르 필터 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {genre === 'all' ? '전체' : genre}
              </button>
            ))}
          </div>
        </div>

        {/* 구독 필터 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="subscribed-only"
            checked={showSubscribedOnly}
            onChange={(e) => setShowSubscribedOnly(e.target.checked)}
            className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="subscribed-only" className="text-sm text-gray-600">
            구독한 스테이션만 보기
          </label>
        </div>
      </div>

      {/* 스테이션 그리드 */}
      <div className="px-6">
        {filteredStations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onPlay={handlePlay}
                onSubscribe={handleSubscribe}
                onStationClick={onStationSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              스테이션을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600">
              검색어나 필터를 변경해보세요
            </p>
          </div>
        )}
      </div>

      {/* 통계 */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>총 {filteredStations.length}개 스테이션</span>
          <span>
            구독 중: {filteredStations.filter(s => s.isSubscribed).length}개
          </span>
        </div>
      </div>
    </div>
  );
};

export default StationFeed;
