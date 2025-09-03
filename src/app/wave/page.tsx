'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WaveFeed from '@/components/features/WaveFeed';
import WaveModal from '@/components/features/WaveModal';
import { Wave } from '@/types';
import { useState } from 'react';

export default function WavePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);
  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false);

  // 인증되지 않은 사용자는 홈으로 리다이렉트
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  // 로딩 상태
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleWaveSelect = (wave: Wave) => {
    setSelectedWave(wave);
    setIsWaveModalOpen(true);
  };

  const handleCloseWaveModal = () => {
    setIsWaveModalOpen(false);
    setSelectedWave(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/app')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">음악 파도타기</h1>
          </div>
          <div className="text-sm text-gray-500">
            {session?.spotifyProfile?.display_name || '사용자'}님
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">실시간 음악 파도타기</h2>
              <p className="text-primary-100">다른 사용자들이 공유한 음악을 발견하고 나만의 음악을 공유해보세요</p>
            </div>
          </div>

          {/* Wave Feed */}
          <div className="space-y-4">
            <WaveFeed onWaveSelect={handleWaveSelect} />
          </div>
        </div>
      </main>

      {/* Wave Modal */}
      <WaveModal
        wave={selectedWave}
        isOpen={isWaveModalOpen}
        onClose={handleCloseWaveModal}
        onReaction={(waveId, type) => {
          console.log(`Modal reaction: ${type} on wave ${waveId}`);
        }}
        onComment={(waveId, content) => {
          console.log(`Modal comment: ${content} on wave ${waveId}`);
        }}
      />
    </div>
  );
}
