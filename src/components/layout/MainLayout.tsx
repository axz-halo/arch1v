'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BottomNavigation from './BottomNavigation';
import WaveFeed from '@/components/features/WaveFeed';
import WaveModal from '@/components/features/WaveModal';
import StationFeed from '@/components/features/StationFeed';
import StationModal from '@/components/features/StationModal';
import ChartFeed from '@/components/features/ChartFeed';
import { TabType, Wave, User, Station } from '@/types';
import { Search, Play, SkipBack, SkipForward } from 'lucide-react';

interface MainLayoutProps {
  initialTab?: TabType;
  showTabs?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  initialTab = 'wave', 
  showTabs = true 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);
  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

  const handleWaveSelect = (wave: Wave) => {
    setSelectedWave(wave);
    setIsWaveModalOpen(true);
  };

  const handleUserSelect = (user: User) => {
    // 실제로는 사용자 프로필 페이지로 이동
    console.log('User selected:', user.displayName);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wave':
        return (
          <div className="space-y-6">
            {/* Now Playing Radio */}
            <div className="now-playing-radio">
              <div className="signal-indicator"></div>
              <div className="radio-display">
                <div className="station-name">Arch1v Radio</div>
                <div className="track-info">Select a track to play</div>
                <div className="artist-info">Various Artists</div>
              </div>
              <div className="playback-controls">
                <button className="control-btn">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button className="control-btn play-btn">
                  <Play className="w-6 h-6 ml-0.5" />
                </button>
                <button className="control-btn">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Wave Feed */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-gray-900">음악 파도타기</h2>
              <WaveFeed 
                onWaveSelect={handleWaveSelect}
                onUserSelect={handleUserSelect}
              />
            </div>
          </div>
        );
      case 'station':
        return (
          <StationFeed 
            onStationSelect={handleStationSelect}
          />
        );
      case 'chart':
        return (
          <ChartFeed 
            onTrackPlay={(track) => {
              // 실제로는 트랙 재생 로직
              console.log('Playing chart track:', track.track.title);
            }}
          />
        );
      case 'profile':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">프로필</h2>
            <p className="text-surface-600">곧 구현될 예정입니다!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo">
            <div className="logo-icon">
              <span className="text-sm font-bold">A</span>
            </div>
            <span>Arch1v</span>
          </Link>
          
          <div className="search-container">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                placeholder="음악, 아티스트, 스테이션 검색..." 
                className="search-input pl-10" 
                type="text"
              />
            </div>
          </div>
          
          <div className="auth-buttons">
            <button className="btn">로그인</button>
            <button className="btn btn-primary">회원가입</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderTabContent()}
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
          // 실제로는 API 호출
          console.log(`Modal reaction: ${type} on wave ${waveId}`);
        }}
        onComment={(waveId, content) => {
          // 실제로는 API 호출
          console.log(`Modal comment: ${content} on wave ${waveId}`);
        }}
      />

      {/* Station 상세 모달 */}
      <StationModal
        station={selectedStation}
        isOpen={isStationModalOpen}
        onClose={handleCloseStationModal}
        onPlay={(track) => {
          // 실제로는 트랙 재생 로직
          console.log('Playing track:', track.title);
        }}
        onSubscribe={(station) => {
          // 실제로는 구독/구독 해제 API 호출
          console.log('Toggle subscription for:', station.name);
        }}
      />
    </div>
  );
};

export default MainLayout;
