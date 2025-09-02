'use client';

import React from 'react';
import { Chart } from '@/types';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, Calendar, Users, Trophy, Vote, Play } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';

interface ChartCardProps {
  chart: Chart;
  onVote?: (chart: Chart, trackId: string) => void;
  onChartClick?: (chart: Chart) => void;
  viewMode?: 'grid' | 'list';
}

const ChartCard: React.FC<ChartCardProps> = ({
  chart,
  onVote,
  onChartClick,
  viewMode = 'grid',
}) => {
  const handleVote = (trackId: string) => {
    onVote?.(chart, trackId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'voting':
        return 'bg-blue-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'voting':
        return '투표중';
      case 'closed':
        return '종료';
      default:
        return '알 수 없음';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => onChartClick?.(chart)}>
        <div className="flex items-center gap-4">
          {/* 썸네일 */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${getStatusColor(chart.status)}`}></div>
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {chart.title}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                chart.status === 'active' ? 'bg-green-100 text-green-800' :
                chart.status === 'voting' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(chart.status)}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {chart.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{chart.period === 'daily' ? '일간' : chart.period === 'weekly' ? '주간' : '월간'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatNumber(chart.participantCount)}명</span>
              </div>
              <div className="flex items-center gap-1">
                <Vote className="w-4 h-4" />
                <span>{formatNumber(chart.totalVotes)}표</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChartClick?.(chart);
              }}
              className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
            >
              <Play className="w-5 h-5 text-white" />
            </button>
            {chart.status === 'active' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 투표 모달 열기
                }}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-200"
              >
                <Vote className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (기본)
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => onChartClick?.(chart)}>
      {/* 헤더 */}
      <div className="relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            chart.status === 'active' ? 'bg-green-500 text-white' :
            chart.status === 'voting' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {getStatusText(chart.status)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            {chart.period === 'daily' ? '일간' : chart.period === 'weekly' ? '주간' : '월간'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
            {chart.title}
          </h3>
          <p className="text-white/80 text-sm line-clamp-1">
            {chart.description}
          </p>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-4">
        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500">참여자</p>
            <p className="text-sm font-semibold text-gray-900">{formatNumber(chart.participantCount)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
              <Vote className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">총 투표</p>
            <p className="text-sm font-semibold text-gray-900">{formatNumber(chart.totalVotes)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500">트랙</p>
            <p className="text-sm font-semibold text-gray-900">{chart.tracks.length}</p>
          </div>
        </div>

        {/* 테마 */}
        <div className="mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
            {chart.theme}
          </span>
        </div>

        {/* 우승자 표시 */}
        {chart.status === 'closed' && chart.winner && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">🏆 우승</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{chart.winner.track.title}</p>
            <p className="text-xs text-gray-600">{chart.winner.track.artist}</p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChartClick?.(chart);
            }}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200"
          >
            자세히 보기
          </button>
          {chart.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 투표 모달 열기
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              투표하기
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChartCard;
