'use client';

import React from 'react';
import { TabType } from '@/types';
import { TrendingUp, Radio, BarChart3, User } from 'lucide-react';

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
      label: '피드',
      icon: TrendingUp,
    },
    {
      id: 'station' as TabType,
      label: '스테이션',
      icon: Radio,
    },
    {
      id: 'chart' as TabType,
      label: '차트',
      icon: BarChart3,
    },
    {
      id: 'profile' as TabType,
      label: '프로필',
      icon: User,
    },
  ];

  return (
    <nav className="tab-navigation">
      <div className="tab-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="tab-icon" />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
