"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Music, User, Check, ArrowRight, SkipForward, Sparkles, Heart, Radio, TrendingUp } from 'lucide-react';
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
      icon: <Sparkles className="w-8 h-8" />,
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
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Music className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Arch1v에 오신 것을 환영합니다!</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                실시간 음악 공유와 커뮤니티를 통해 새로운 음악을 발견하고, 
                나만의 음악 DNA를 만들어보세요.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-900">실시간 음악 파도타기</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-purple-900">개인화된 음악 추천</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-900">커뮤니티 음악 차트</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">프로필 설정</h2>
              <p className="text-gray-600 text-lg">다른 사용자들에게 보여질 프로필을 설정해주세요</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  닉네임 *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="멋진 닉네임을 입력해주세요"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  자기소개 (선택사항)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="당신의 음악 취향이나 소개를 자유롭게 작성해주세요"
                  rows={4}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Spotify 연동</h2>
              <p className="text-gray-600 text-lg">Spotify 계정을 연동하여 음악 취향을 분석하고 공유하세요</p>
            </div>
            
            <Card className="p-8 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Spotify</h3>
                    <p className="text-gray-600">음악 취향 분석 및 플레이리스트 연동</p>
                  </div>
                </div>
                
                {spotifyConnected ? (
                  <div className="flex items-center gap-3 text-green-600 bg-green-50 px-6 py-3 rounded-full">
                    <Check className="w-6 h-6" />
                    <span className="font-semibold text-lg">연동됨</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleSpotifyConnect}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg"
                  >
                    {loading ? '연동 중...' : '연동하기'}
                  </Button>
                )}
              </div>
            </Card>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-4 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                연동 시 제공되는 기능
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-800">현재 재생 중인 음악 자동 공유</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-800">개인 음악 취향 분석</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-800">플레이리스트 기반 스테이션 생성</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-800">음악 DNA 시각화</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 진행 상태 표시 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <Check className="w-6 h-6" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.id ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h1>
            <p className="text-gray-600 text-lg">
              {steps[currentStep - 1].subtitle}
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <Card className="p-8 shadow-xl border-0">
          {renderStepContent()}
        </Card>

        {/* 네비게이션 버튼 */}
        <div className="flex items-center justify-between mt-12">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 px-6 py-3 text-lg"
          >
            <SkipForward className="w-5 h-5 mr-2" />
            건너뛰기
          </Button>
          
          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-8 py-3 text-lg"
              >
                이전
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 2 && !displayName.trim()}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-8 py-3 text-lg font-semibold rounded-2xl"
              >
                다음
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg font-semibold rounded-2xl"
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
