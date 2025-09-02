'use client';

import React, { useState, useMemo } from 'react';
import { Station } from '@/types';
import { mockStations } from '@/lib/mockData';
import StationCard from './StationCard';
import { Filter, Search, Plus, Radio, TrendingUp, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface StationFeedProps {
  onStationSelect?: (station: Station) => void;
}

const StationFeed: React.FC<StationFeedProps> = ({ onStationSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const handleCreateStation = () => {
    // 실제로는 새 스테이션 생성 모달 또는 페이지로 이동
    console.log('Create new station');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">스테이션</h1>
              <p className="text-gray-600">나만의 음악 스테이션을 만들고 발견하세요</p>
            </div>
          </div>
          <Button
            onClick={handleCreateStation}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 스테이션
          </Button>
        </div>
        
        {/* 검색바 */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="스테이션 이름이나 설명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none text-lg"
          />
        </div>

        {/* 필터 및 뷰 모드 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* 장르 필터 */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">장르:</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedGenre === genre
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {genre === 'all' ? '전체' : genre}
                  </button>
                ))}
              </div>
            </div>

            {/* 구독 필터 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="subscribed-only"
                checked={showSubscribedOnly}
                onChange={(e) => setShowSubscribedOnly(e.target.checked)}
                className="w-5 h-5 text-blue-500 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500"
              />
              <label htmlFor="subscribed-only" className="text-sm font-semibold text-gray-700">
                구독한 스테이션만
              </label>
            </div>
          </div>

          {/* 뷰 모드 토글 */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">총 스테이션</p>
                <p className="text-2xl font-bold text-blue-900">{filteredStations.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">구독 중</p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredStations.filter(s => s.isSubscribed).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">인기 스테이션</p>
                <p className="text-2xl font-bold text-purple-900">
                  {filteredStations.filter(s => s.subscriberCount > 100).length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 스테이션 그리드/리스트 */}
      <div className="px-6">
        {filteredStations.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onPlay={handlePlay}
                onSubscribe={handleSubscribe}
                onStationClick={onStationSelect}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              스테이션을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              검색어나 필터를 변경해보세요
            </p>
            <Button
              onClick={handleCreateStation}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              첫 번째 스테이션 만들기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StationFeed;
