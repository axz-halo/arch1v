'use client';

import React, { useState, useMemo } from 'react';
import { Chart } from '@/types';
import { mockCharts } from '@/lib/mockData';
import ChartCard from './ChartCard';
import { Filter, Search, TrendingUp, Calendar, Trophy, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ChartFeedProps {
  onChartSelect?: (chart: Chart) => void;
}

const ChartFeed: React.FC<ChartFeedProps> = ({ onChartSelect }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 기간 목록
  const periods = useMemo(() => {
    const periodSet = new Set(mockCharts.map(chart => chart.period));
    return ['all', ...Array.from(periodSet)];
  }, []);

  // 필터링된 차트
  const filteredCharts = useMemo(() => {
    return mockCharts.filter(chart => {
      const matchesPeriod = selectedPeriod === 'all' || chart.period === selectedPeriod;
      const matchesSearch = chart.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           chart.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !showActiveOnly || chart.status === 'active';
      
      return matchesPeriod && matchesSearch && matchesStatus;
    });
  }, [selectedPeriod, searchQuery, showActiveOnly]);

  const handleVote = (chart: Chart, trackId: string) => {
    // 실제로는 투표 API 호출
    console.log('Voting for track:', trackId, 'in chart:', chart.title);
  };

  const handleCreateChart = () => {
    // 실제로는 새 차트 생성 모달 또는 페이지로 이동
    console.log('Create new chart');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="px-6 py-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">차트</h1>
              <p className="text-gray-600">커뮤니티 투표로 인기 음악을 선별하세요</p>
            </div>
          </div>
          <Button
            onClick={handleCreateChart}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold"
          >
            <Trophy className="w-5 h-5 mr-2" />
            새 차트
          </Button>
        </div>
        
        {/* 검색바 */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="차트 제목이나 설명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 outline-none text-lg"
          />
        </div>

        {/* 필터 및 뷰 모드 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* 기간 필터 */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">기간:</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedPeriod === period
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {period === 'all' ? '전체' : period === 'daily' ? '일간' : period === 'weekly' ? '주간' : '월간'}
                  </button>
                ))}
              </div>
            </div>

            {/* 활성 차트 필터 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active-only"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="w-5 h-5 text-purple-500 bg-white border-2 border-gray-300 rounded-lg focus:ring-purple-500"
              />
              <label htmlFor="active-only" className="text-sm font-semibold text-gray-700">
                활성 차트만
              </label>
            </div>
          </div>

          {/* 뷰 모드 토글 */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-700'
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">총 차트</p>
                <p className="text-2xl font-bold text-purple-900">{filteredCharts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">활성 차트</p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredCharts.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">총 참여자</p>
                <p className="text-2xl font-bold text-blue-900">
                  {filteredCharts.reduce((sum, chart) => sum + chart.participantCount, 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">완료된 차트</p>
                <p className="text-2xl font-bold text-orange-900">
                  {filteredCharts.filter(c => c.status === 'closed').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 차트 그리드/리스트 */}
      <div className="px-6">
        {filteredCharts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCharts.map((chart) => (
              <ChartCard
                key={chart.id}
                chart={chart}
                onVote={handleVote}
                onChartClick={onChartSelect}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              차트를 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              검색어나 필터를 변경해보세요
            </p>
            <Button
              onClick={handleCreateChart}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-3 rounded-xl font-semibold"
            >
              <Trophy className="w-5 h-5 mr-2" />
              첫 번째 차트 만들기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChartFeed;
