'use client';

import React, { useState } from 'react';
import { Station, Track } from '@/types';
import { formatTime } from '@/lib/utils';
import { X, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';

interface StationModalProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay?: (track: Track) => void;
  onSubscribe?: (station: Station) => void;
}

type TabType = 'current' | 'queue' | 'playlist';

const StationModal: React.FC<StationModalProps> = ({
  station,
  isOpen,
  onClose,
  onPlay,
  onSubscribe,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !station) return null;

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    if (station.currentTrack) {
      onPlay?.(station.currentTrack);
    }
  };

  const handleSubscribe = () => {
    onSubscribe?.(station);
  };

  const renderCurrentTrack = () => (
    <div className="text-center p-6">
      {station.currentTrack ? (
        <>
          <div className="relative inline-block mb-6">
            <div className={`w-48 h-48 rounded-full overflow-hidden shadow-lg transition-all duration-300 ${isPlaying ? 'animate-spin' : ''}`}>
              <Image
                src={station.currentTrack.albumArt}
                alt={station.currentTrack.album}
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* 바늘 */}
            {isPlaying && (
              <div className="absolute -top-2 right-8 w-1 h-24 bg-surface-400 rounded-full transform rotate-12 origin-bottom"></div>
            )}
          </div>

          <h3 className="text-xl font-bold text-surface-900 mb-2">
            {station.currentTrack.title}
          </h3>
          <p className="text-lg text-surface-600 mb-4">
            {station.currentTrack.artist}
          </p>

          {/* 컨트롤 */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button className="p-2 rounded-full hover:bg-surface-100 transition-colors">
              <SkipBack className="w-6 h-6 text-surface-600" />
            </button>
            
            <button
              onClick={handlePlayToggle}
              className="bg-primary-500 text-white p-4 rounded-full hover:bg-primary-600 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
            
            <button className="p-2 rounded-full hover:bg-surface-100 transition-colors">
              <SkipForward className="w-6 h-6 text-surface-600" />
            </button>
          </div>

          {/* 진행바 */}
          <div className="w-full bg-surface-200 rounded-full h-1 mb-4">
            <div className="bg-primary-500 h-1 rounded-full" style={{ width: '45%' }}></div>
          </div>
          
          <div className="flex justify-between text-sm text-surface-500">
            <span>2:15</span>
            <span>{formatTime(station.currentTrack.duration)}</span>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-12 h-12 text-surface-400" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            재생 중인 곡이 없습니다
          </h3>
          <p className="text-surface-600">
            스테이션을 재생해보세요
          </p>
        </div>
      )}
    </div>
  );

  const renderQueue = () => (
    <div className="p-6">
      <h3 className="font-semibold text-surface-900 mb-4">대기열</h3>
      {station.queue.length > 0 ? (
        <div className="space-y-3">
          {station.queue.map((track, index) => (
            <div key={track.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
              <Image
                src={track.albumArt}
                alt={track.album}
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-surface-900 truncate">{track.title}</h4>
                <p className="text-sm text-surface-600 truncate">{track.artist}</p>
              </div>
              <div className="text-sm text-surface-500">
                {formatTime(track.duration)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-surface-500">
          대기열이 비어있습니다
        </div>
      )}
    </div>
  );

  const renderPlaylist = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-surface-900">플레이리스트</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-surface-100 transition-colors">
            <Heart className="w-4 h-4 text-surface-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-100 transition-colors">
            <Share2 className="w-4 h-4 text-surface-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <span className="text-primary-600 font-semibold">YT</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-surface-900">YouTube 플레이리스트</h4>
            <p className="text-sm text-surface-600">총 {station.queue.length + 1}곡</p>
          </div>
          <button className="px-3 py-1 bg-primary-500 text-white text-xs rounded-full">
            열기
          </button>
        </div>
        
        <div className="text-sm text-surface-600">
          <p>채널: {station.youtubeChannelId}</p>
          <p>구독자: {station.subscriberCount.toLocaleString()}명</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 top-20 bg-white rounded-t-3xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-surface-900">{station.name}</h2>
            <p className="text-sm text-surface-500">{station.genre}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-surface-200">
            {[
              { id: 'current' as TabType, label: '현재 재생' },
              { id: 'queue' as TabType, label: '대기열' },
              { id: 'playlist' as TabType, label: '플레이리스트' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          <div className="flex-1">
            {activeTab === 'current' && renderCurrentTrack()}
            {activeTab === 'queue' && renderQueue()}
            {activeTab === 'playlist' && renderPlaylist()}
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="p-6 border-t border-surface-200">
          <button
            onClick={handleSubscribe}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              station.isSubscribed
                ? 'bg-surface-100 text-surface-700'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {station.isSubscribed ? '구독 해제' : '구독하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationModal;
