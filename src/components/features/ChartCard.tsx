'use client';

import React, { useState } from 'react';
import { ChartTrack } from '@/types';
import { formatNumber } from '@/lib/utils';
import { Heart, X, Music, Vote } from 'lucide-react';
import Image from 'next/image';

interface ChartCardProps {
  track: ChartTrack;
  onVote: (trackId: string, vote: 'like' | 'dislike') => void;
  onPlay?: (track: ChartTrack) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  track,
  onVote,
  onPlay,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isVoting, setIsVoting] = useState(false);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const offset = currentX - startX;
    setDragOffset(offset);
    
    // 드래그 임계값에 도달하면 자동 투표
    if (offset > 100) {
      setIsVoting(true);
      onVote(track.id, 'like');
      setIsDragging(false);
      setDragOffset(0);
    } else if (offset < -100) {
      setIsVoting(true);
      onVote(track.id, 'dislike');
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleVote = (vote: 'like' | 'dislike') => {
    onVote(track.id, vote);
  };

  const handlePlay = () => {
    onPlay?.(track);
  };

  return (
    <div 
      className={`chart-card ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* 앨범아트 */}
      <div className="relative aspect-square">
        <Image
          src={track.track.albumArt}
          alt={track.track.album}
          fill
          className="object-cover"
        />
        
        {/* 투표 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* 투표 버튼 */}
        <div className="chart-vote-buttons">
          <button
            onClick={() => handleVote('dislike')}
            className="chart-vote-btn dislike hover:scale-110 transition-transform"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
          
          <button
            onClick={handlePlay}
            className="chart-vote-btn play hover:scale-110 transition-transform"
          >
            <Music className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => handleVote('like')}
            className="chart-vote-btn like hover:scale-110 transition-transform"
          >
            <Heart className="w-6 h-6 text-green-500" />
          </button>
        </div>
      </div>

      {/* 트랙 정보 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-500">
              {formatNumber(track.votes)}표
            </span>
          </div>
          
          {track.isWinner && (
            <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              🏆 우승
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {track.track.title}
        </h3>
        <p className="text-lg text-gray-600 mb-1">
          {track.track.artist}
        </p>
        <p className="text-sm text-gray-500">
          {track.track.album} • {track.track.genre}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            제출자: <span className="font-medium">{track.submittedBy}</span>
          </p>
        </div>
      </div>

      {/* 스와이프 힌트 */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
        <div className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full opacity-0 transition-opacity">
          싫어요
        </div>
        <div className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full opacity-0 transition-opacity">
          좋아요
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
