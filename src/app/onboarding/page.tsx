"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Music, User, Check, ArrowRight, SkipForward } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    }
    if ((profile as { spotifyConnected?: boolean })?.spotifyConnected) {
      setSpotifyConnected(true);
    }
  }, [user, profile, router]);

  const handleSpotifyConnect = async () => {
    setLoading(true);
    try {
      const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}&scope=user-read-private,user-read-email,user-top-read,playlist-read-private,playlist-modify-public,playlist-modify-private`;
      window.location.href = spotifyAuthUrl;
    } catch (error) {
      console.error('Spotify 연결 실패:', error);
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      // 실제로는 API 호출로 프로필 업데이트
      console.log('온보딩 완료:', { displayName, bio, spotifyConnected });
      
      // 메인 앱으로 이동
      setTimeout(() => {
        router.push('/app');
      }, 1000);
    } catch (error) {
      console.error('온보딩 완료 실패:', error);
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/app');
  };

  const steps = [
    {
      id: 1,
      title: '환영합니다!',
      subtitle: 'Arch1v에서 나만의 음악 여정을 시작해보세요',
      icon: <Music className="w-8 h-8" />,
    },
    {
      id: 2,
      title: '프로필 설정',
      subtitle: '다른 사용자들에게 보여질 프로필을 설정해주세요',
      icon: <User className="w-8 h-8" />,
    },
    {
      id: 3,
      title: 'Spotify 연동',
      subtitle: 'Spotify 계정을 연동하여 음악 취향을 분석하고 공유하세요',
      icon: <Music className="w-8 h-8" />,
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Arch1v에 오신 것을 환영합니다!</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              실시간 음악 공유와 커뮤니티를 통해 새로운 음악을 발견하고, 
              나만의 음악 DNA를 만들어보세요.
            </p>
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                <Check className="w-4 h-4 text-green-500" />
                <span>실시간 음악 파도타기</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                <Check className="w-4 h-4 text-green-500" />
                <span>개인화된 음악 추천</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                <Check className="w-4 h-4 text-green-500" />
                <span>커뮤니티 음악 차트</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">프로필 설정</h2>
              <p className="text-gray-600">다른 사용자들에게 보여질 프로필을 설정해주세요</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자기소개 (선택사항)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자기소개를 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Spotify 연동</h2>
              <p className="text-gray-600">Spotify 계정을 연동하여 음악 취향을 분석하고 공유하세요</p>
            </div>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Spotify</h3>
                    <p className="text-sm text-gray-600">음악 취향 분석 및 플레이리스트 연동</p>
                  </div>
                </div>
                
                {spotifyConnected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">연동됨</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleSpotifyConnect}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {loading ? '연동 중...' : '연동하기'}
                  </Button>
                )}
              </div>
            </Card>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">연동 시 제공되는 기능</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 현재 재생 중인 음악 자동 공유</li>
                <li>• 개인 음악 취향 분석</li>
                <li>• 플레이리스트 기반 스테이션 생성</li>
                <li>• 음악 DNA 시각화</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return <div className="p-6">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* 진행 상태 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h1>
            <p className="text-gray-600 mt-1">
              {steps[currentStep - 1].subtitle}
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <Card className="p-8">
          {renderStepContent()}
        </Card>

        {/* 네비게이션 버튼 */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            건너뛰기
          </Button>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                이전
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 2 && !displayName.trim()}
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="bg-primary-500 hover:bg-primary-600"
              >
                {loading ? '완료 중...' : '온보딩 완료'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
