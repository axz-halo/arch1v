'use client';

import React from 'react';
import { Station } from '@/types';
import { formatNumber } from '@/lib/utils';
import { Play, Pause, Users, Music } from 'lucide-react';
import Image from 'next/image';

interface StationCardProps {
  station: Station;
  onPlay?: (station: Station) => void;
  onSubscribe?: (station: Station) => void;
  onStationClick?: (station: Station) => void;
}

const StationCard: React.FC<StationCardProps> = ({
  station,
  onPlay,
  onSubscribe,
  onStationClick,
}) => {
  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(station);
  };

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSubscribe?.(station);
  };

  return (
    <div 
      className="station-card cursor-pointer"
      onClick={() => onStationClick?.(station)}
    >
      {/* 썸네일 */}
      <div className="station-thumbnail">
        <Image
          src={station.thumbnail}
          alt={station.name}
          fill
          className="object-cover"
        />
        
        {/* 플레이 오버레이 */}
        <div className="station-overlay">
          <button
            onClick={handlePlayToggle}
            className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors"
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
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              station.isSubscribed
                ? 'bg-primary-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            {station.isSubscribed ? '구독중' : '구독'}
          </button>
        </div>

        {/* 현재 재생 중 표시 */}
        {station.currentTrack && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            재생중
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="station-info">
        <h3 className="station-name">
          {station.name}
        </h3>
        <p className="station-description">
          {station.description}
        </p>
        
        <div className="station-stats">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{formatNumber(station.subscriberCount)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            <span>{station.genre}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
