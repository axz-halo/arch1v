'use client';

import React from 'react';
import { Station } from '@/types';
import { formatNumber } from '@/lib/utils';
import { Play, Pause, Users, Music, Heart } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';

interface StationCardProps {
  station: Station;
  onPlay?: (station: Station) => void;
  onSubscribe?: (station: Station) => void;
  onStationClick?: (station: Station) => void;
  viewMode?: 'grid' | 'list';
}

const StationCard: React.FC<StationCardProps> = ({
  station,
  onPlay,
  onSubscribe,
  onStationClick,
  viewMode = 'grid',
}) => {
  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(station);
  };

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSubscribe?.(station);
  };

  if (viewMode === 'list') {
    return (
      <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => onStationClick?.(station)}>
        <div className="flex items-center gap-4">
          {/* 썸네일 */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={station.thumbnail}
              alt={station.name}
              fill
              className="object-cover"
            />
            {station.currentTrack && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {station.name}
              </h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {station.genre}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {station.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatNumber(station.subscriberCount)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Music className="w-4 h-4" />
                <span>{station.genre}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handlePlayToggle}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              {station.currentTrack ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>
            <button
              onClick={handleSubscribe}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                station.isSubscribed
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${station.isSubscribed ? 'text-white fill-white' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (기본)
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => onStationClick?.(station)}>
      {/* 썸네일 */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={station.thumbnail}
          alt={station.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* 플레이 오버레이 */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayToggle}
            className="bg-white/90 rounded-full p-4 hover:bg-white transition-all duration-200 transform scale-90 group-hover:scale-100"
          >
            {station.currentTrack ? (
              <Pause className="w-6 h-6 text-gray-900" />
            ) : (
              <Play className="w-6 h-6 text-gray-900 ml-0.5" />
            )}
          </button>
        </div>

        {/* 구독 상태 */}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleSubscribe}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              station.isSubscribed
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 text-gray-700 hover:bg-white shadow-lg'
            }`}
          >
            {station.isSubscribed ? '구독중' : '구독'}
          </button>
        </div>

        {/* 현재 재생 중 표시 */}
        {station.currentTrack && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            재생중
          </div>
        )}

        {/* 장르 태그 */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 text-gray-700 rounded-full text-sm font-medium">
            {station.genre}
          </span>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {station.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {station.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{formatNumber(station.subscriberCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Music className="w-4 h-4" />
              <span>{station.genre}</span>
            </div>
          </div>
          
          {/* 인기도 표시 */}
          {station.subscriberCount > 100 && (
            <div className="flex items-center gap-1 text-orange-500">
              <span className="text-xs">🔥</span>
              <span className="text-xs">인기</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StationCard;
