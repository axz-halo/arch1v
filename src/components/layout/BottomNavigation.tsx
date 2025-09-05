'use client';

import React from 'react';
import { TabType } from '@/types';
import { Music, Radio, TrendingUp, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'wave' as TabType,
      label: '파도',
      icon: Music,
    },
    {
      id: 'station' as TabType,
      label: '스테이션',
      icon: Radio,
    },
    {
      id: 'chart' as TabType,
      label: '차트',
      icon: TrendingUp,
    },
    {
      id: 'profile' as TabType,
      label: '프로필',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 safe-area-pb">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 touch-target-large ${
                isActive 
                  ? 'text-primary-500 bg-primary-50 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              aria-label={`${tab.label} 탭으로 이동`}
            >
              <div className={`w-6 h-6 transition-all duration-200 ${
                isActive ? 'scale-110' : ''
              }`}>
                <Icon className="w-full h-full" />
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
