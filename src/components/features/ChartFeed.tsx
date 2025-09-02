'use client';

import React, { useState, useEffect } from 'react';
import { Chart, ChartTrack } from '@/types';
import { mockCharts } from '@/lib/mockData';
import ChartCard from './ChartCard';
import { Trophy, Gift, Music } from 'lucide-react';

interface ChartFeedProps {
  onTrackPlay?: (track: ChartTrack) => void;
}

const ChartFeed: React.FC<ChartFeedProps> = ({ onTrackPlay }) => {
  const [currentChart] = useState<Chart>(mockCharts[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [votedTracks, setVotedTracks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'voting' | 'leaderboard' | 'history' | 'hall'>('voting');
  const [allTracks, setAllTracks] = useState<ChartTrack[]>([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 23
  });

    // 모든 트랙 데이터 초기화
  useEffect(() => {
    const allChartTracks = mockCharts.flatMap(chart => chart.tracks);
    console.log('All chart tracks:', allChartTracks.length, allChartTracks);
    // 트랙들을 섞어서 랜덤하게 배치
    const shuffledTracks = [...allChartTracks].sort(() => Math.random() - 0.5);
    setAllTracks(shuffledTracks);
  }, []);

  // 카운트다운 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (trackId: string, vote: 'like' | 'dislike') => {
    console.log(`Vote: ${vote} for track ${trackId}`);
    console.log('Current track index:', currentTrackIndex, 'Total tracks:', allTracks.length);
    setVotedTracks(prev => new Set([...prev, trackId]));
    
    // 즉시 다음 트랙으로 이동
    if (currentTrackIndex < allTracks.length - 1) {
      console.log('Moving to next track:', currentTrackIndex + 1);
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      // 모든 트랙을 투표했으면 다시 섞어서 처음부터
      console.log('Reshuffling tracks');
      const shuffledTracks = [...allTracks].sort(() => Math.random() - 0.5);
      setAllTracks(shuffledTracks);
      setCurrentTrackIndex(0);
      setVotedTracks(new Set());
    }
  };

  const handlePlay = (track: ChartTrack) => {
    onTrackPlay?.(track);
  };

  const currentTrack = allTracks[currentTrackIndex];
  const hasVotedAll = currentTrackIndex >= allTracks.length || votedTracks.size >= allTracks.length;
  
  console.log('Current track:', currentTrack, 'Index:', currentTrackIndex, 'Total:', allTracks.length);

  // 리더보드 렌더링
  const renderLeaderboard = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">실시간 투표 순위</h3>
      <div className="space-y-3">
        {allTracks
          .sort((a, b) => b.votes - a.votes)
          .map((track, index) => (
            <div key={track.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-600">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{track.track.title}</h4>
                <p className="text-sm text-gray-600">{track.track.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary-600">{track.votes}표</span>
                {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // 역대 차트 렌더링
  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">역대 차트</h3>
      <div className="space-y-4">
        {mockCharts.map((chart) => (
          <div key={chart.id} className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{chart.title}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                chart.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {chart.isActive ? '진행중' : '종료'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{chart.description}</p>
            {chart.winner && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">🏆 우승: {chart.winner.track.title}</p>
                  <p className="text-xs text-gray-600">{chart.winner.track.artist}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 명예의 전당 렌더링
  const renderHallOfFame = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">명예의 전당</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {mockCharts
          .filter(chart => chart.winner)
          .map((chart) => (
            <div key={chart.id} className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{chart.title}</h4>
                  <p className="text-xs text-gray-600">{chart.theme}</p>
                </div>
              </div>
              {chart.winner && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">🏆 {chart.winner.track.title}</p>
                  <p className="text-sm text-gray-600">{chart.winner.track.artist}</p>
                  <p className="text-xs text-gray-500">제출자: {chart.winner.submittedBy}</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 주간 테마 헤더 */}
      <div className="weekly-theme-header">
        <div className="theme-background">
          <div className="theme-content">
            <div className="theme-emoji">🌙</div>
            <h1 className="theme-title">깊은 밤의 감성</h1>
            <p className="theme-description">
              밤늦게 혼자 듣기 좋은 감성적인 트랙들을 추천해주세요
            </p>
            
            {/* 카운트다운 타이머 */}
            <div className="countdown-timer">
              <div className="timer-label">투표 마감까지</div>
              <div className="timer-display">
                <div className="timer-unit">
                  <span className="timer-number">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="timer-label-small">일</span>
                </div>
                <div className="timer-separator">:</div>
                <div className="timer-unit">
                  <span className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="timer-label-small">시간</span>
                </div>
                <div className="timer-separator">:</div>
                <div className="timer-unit">
                  <span className="timer-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="timer-label-small">분</span>
                </div>
                <div className="timer-separator">:</div>
                <div className="timer-unit">
                  <span className="timer-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="timer-label-small">초</span>
                </div>
              </div>
            </div>
            
            {/* 상금 풀 */}
            <div className="prize-pool">
              <Gift className="w-5 h-5" />
              <span>상금 풀: ₩100,000</span>
            </div>
            
            {/* 트랙 제출 버튼 */}
            <button className="submit-track-btn">
              <Music className="w-5 h-5" />
              트랙 제출하기
            </button>
          </div>
        </div>
      </div>

      {/* 투표 상태 */}
      <div className="voting-status">
        <div className="status-item">
          <span className="status-label">남은 투표</span>
          <span className="status-value">{currentChart.tracks.length - votedTracks.size}/{currentChart.tracks.length}</span>
        </div>
        <div className="status-item">
          <span className="status-label">투표 파워</span>
          <span className="status-value">1x</span>
        </div>
        <div className="status-item">
          <span className="status-label">예상 순위</span>
          <span className="status-value">#23</span>
        </div>
        <div className="status-item">
          <span className="status-label">취향 일치도</span>
          <span className="status-value">67%</span>
        </div>
      </div>

                            {/* 차트 네비게이션 */}
                      <div className="chart-navigation">
                        <div className="flex gap-4 mb-6">
                          <button 
                            className={`btn ${activeTab === 'voting' ? 'btn-primary' : ''}`}
                            onClick={() => setActiveTab('voting')}
                          >
                            투표하기
                          </button>
                          <button 
                            className={`btn ${activeTab === 'leaderboard' ? 'btn-primary' : ''}`}
                            onClick={() => setActiveTab('leaderboard')}
                          >
                            리더보드
                          </button>
                          <button 
                            className={`btn ${activeTab === 'history' ? 'btn-primary' : ''}`}
                            onClick={() => setActiveTab('history')}
                          >
                            역대 차트
                          </button>
                          <button 
                            className={`btn ${activeTab === 'hall' ? 'btn-primary' : ''}`}
                            onClick={() => setActiveTab('hall')}
                          >
                            명예의 전당
                          </button>
                        </div>
                      </div>

                            {/* 탭 콘텐츠 */}
                      {activeTab === 'voting' && (
                        <div className="voting-section">
                          <h3 className="text-lg font-medium mb-4 text-center">스와이프하여 투표하세요</h3>
                          <p className="text-sm text-gray-600 text-center mb-6">← 왼쪽: 별로 | 오른쪽: 좋아요 →</p>

                                                  <div className="voting-cards-container">
                          {allTracks.length > 0 && currentTrack && !hasVotedAll ? (
                            <ChartCard
                              track={currentTrack}
                              onVote={handleVote}
                              onPlay={handlePlay}
                            />
                                                    ) : hasVotedAll ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-8 h-8 text-primary-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                모든 곡에 투표 완료!
                              </h3>
                              <p className="text-gray-600 mb-6">
                                결과를 확인해보세요
                              </p>
                              <button className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
                                결과 보기
                              </button>
                            </div>
                          ) : allTracks.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Music className="w-8 h-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                로딩 중...
                              </h3>
                              <p className="text-gray-600">
                                곡을 불러오는 중입니다
                              </p>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Music className="w-8 h-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                곡을 준비 중입니다...
                              </h3>
                              <p className="text-gray-600">
                                잠시만 기다려주세요
                              </p>
                            </div>
                          )}
                          </div>
                        </div>
                      )}

                      {activeTab === 'leaderboard' && renderLeaderboard()}
                      {activeTab === 'history' && renderHistory()}
                      {activeTab === 'hall' && renderHallOfFame()}
    </div>
  );
};

export default ChartFeed;
