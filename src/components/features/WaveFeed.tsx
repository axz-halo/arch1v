'use client';

import React, { useState, useEffect } from 'react';
import { Wave, User } from '@/types';
import { mockWaves, generateMoreWaves } from '@/lib/mockData';
import WaveCard from './WaveCard';

interface WaveFeedProps {
  onWaveSelect?: (wave: Wave) => void;
  onUserSelect?: (user: User) => void;
}

const WaveFeed: React.FC<WaveFeedProps> = ({
  onWaveSelect,
  onUserSelect,
}) => {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // 초기 데이터 로드
    setWaves(mockWaves);
  }, []);

  const loadMoreWaves = async () => {
    if (loading) return;
    
    setLoading(true);
    
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newWaves = generateMoreWaves(page + 1);
    setWaves(prev => [...prev, ...newWaves]);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  const handleReaction = (waveId: string, type: 'like' | 'love' | 'fire') => {
    // 실제로는 API 호출
    console.log(`Reaction: ${type} on wave ${waveId}`);
  };

  const handleComment = (waveId: string) => {
    // 실제로는 댓글 모달 열기
    console.log(`Comment on wave ${waveId}`);
  };

  const handleShare = (waveId: string) => {
    // 실제로는 공유 기능
    console.log(`Share wave ${waveId}`);
  };

  return (
    <div className="space-y-4">
      {waves.map((wave, index) => (
        <WaveCard
          key={wave.id}
          wave={wave}
          onWaveSelect={onWaveSelect}
          onUserSelect={onUserSelect}
          onReaction={handleReaction}
          onComment={handleComment}
          onShare={handleShare}
          priority={index === 0} // 첫 번째 카드에만 priority 적용
        />
      ))}
      
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
      
      {!loading && waves.length > 0 && (
        <div className="text-center py-4">
          <button
            onClick={loadMoreWaves}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default WaveFeed;
