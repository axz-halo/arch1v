'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StationFeed from '@/components/features/StationFeed';
import StationModal from '@/components/features/StationModal';
import { Station } from '@/types';
import { useState } from 'react';

export default function StationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

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

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setIsStationModalOpen(true);
  };

  const handleCloseStationModal = () => {
    setIsStationModalOpen(false);
    setSelectedStation(null);
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
            <h1 className="text-xl font-bold text-gray-900">나만의 스테이션</h1>
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
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">나만의 음악 스테이션</h2>
              <p className="text-blue-100">플레이리스트를 구독하고 관리하여 나만의 음악 스테이션을 만들어보세요</p>
            </div>
          </div>

          {/* Station Feed */}
          <div className="space-y-4">
            <StationFeed onStationSelect={handleStationSelect} />
          </div>
        </div>
      </main>

      {/* Station Modal */}
      <StationModal
        station={selectedStation}
        isOpen={isStationModalOpen}
        onClose={handleCloseStationModal}
        onPlay={(track) => {
          console.log('Playing track:', track.title);
        }}
        onSubscribe={(station) => {
          console.log('Toggle subscription for:', station.name);
        }}
      />
    </div>
  );
}
