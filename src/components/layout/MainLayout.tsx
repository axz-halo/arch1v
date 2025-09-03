'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import BottomNavigation from './BottomNavigation';
import WaveFeed from '@/components/features/WaveFeed';
import WaveModal from '@/components/features/WaveModal';
import StationFeed from '@/components/features/StationFeed';
import StationModal from '@/components/features/StationModal';
import ChartFeed from '@/components/features/ChartFeed';
import { TabType, Wave, Station } from '@/types';
import { Search, Play, SkipBack, SkipForward, Music, User, Bell, Settings } from 'lucide-react';

interface MainLayoutProps {
  initialTab?: TabType;
  showTabs?: boolean;
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  initialTab = 'wave', 
  showTabs = true,
  children 
}) => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);
  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleWaveSelect = (wave: Wave) => {
    setSelectedWave(wave);
    setIsWaveModalOpen(true);
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setIsStationModalOpen(true);
  };

  const handleCloseWaveModal = () => {
    setIsWaveModalOpen(false);
    setSelectedWave(null);
  };

  const handleCloseStationModal = () => {
    setIsStationModalOpen(false);
    setSelectedStation(null);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wave':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Music className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">안녕하세요, {session?.spotifyProfile?.display_name || '사용자'}님!</h1>
                    <p className="text-primary-100">오늘의 음악을 발견해보세요</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-primary-100 mb-2">현재 재생 중</p>
                    <p className="font-semibold">음악을 선택해주세요</p>
                  </div>
                  <button 
                    onClick={handlePlayPause}
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Play className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-primary-500 mb-1">24</div>
                <div className="text-sm text-gray-600">오늘의 파도</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-green-500 mb-1">156</div>
                <div className="text-sm text-gray-600">총 공유</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-purple-500 mb-1">89</div>
                <div className="text-sm text-gray-600">팔로워</div>
              </div>
            </div>

            {/* Wave Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">음악 파도타기</h2>
                <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                  모두 보기
                </button>
              </div>
              <WaveFeed 
                onWaveSelect={handleWaveSelect}
              />
            </div>
          </div>
        );
      case 'station':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">나만의 스테이션</h2>
              <p className="text-blue-100">플레이리스트를 구독하고 관리하세요</p>
            </div>
            <StationFeed 
              onStationSelect={handleStationSelect}
            />
          </div>
        );
      case 'chart':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">주간 차트</h2>
              <p className="text-purple-100">커뮤니티가 선정한 인기 음악</p>
            </div>
            <ChartFeed 
              onChartSelect={(chart) => {
                console.log('Selected chart:', chart.title);
              }}
            />
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{session?.spotifyProfile?.display_name || '사용자'}</h2>
                  <p className="text-gray-200">{session?.spotifyProfile?.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-primary-500 mb-1">1,234</div>
                <div className="text-sm text-gray-600">총 공유</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-green-500 mb-1">567</div>
                <div className="text-sm text-gray-600">팔로워</div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="space-y-3">
              <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">설정</span>
                </div>
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-red-500">로그아웃</span>
                </div>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold text-gray-900 no-underline">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white">
              <span className="text-sm font-bold">A</span>
            </div>
            <span>Arch1v</span>
          </Link>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="음악, 아티스트, 스테이션 검색..." 
                className="w-full bg-gray-100 border-0 rounded-xl py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200" 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
              <Bell className="w-5 h-5" />
            </button>
            {session?.spotifyProfile?.images?.[0]?.url ? (
              <img 
                src={session.spotifyProfile.images[0].url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children || renderTabContent()}
      </main>

      {/* Tab Navigation */}
      {showTabs && (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}

      {/* Wave 상세 모달 */}
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

      {/* Station 상세 모달 */}
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
};

export default MainLayout;
