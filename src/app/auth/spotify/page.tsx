'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Music, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { signIn, useSession } from 'next-auth/react';

export default function SpotifyAuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 이미 로그인된 경우 온보딩으로 리다이렉트
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push('/onboarding');
    }
  }, [status, router]);

  const handleSpotifyLogin = () => {
    signIn('spotify', { callbackUrl: '/onboarding' });
  };

  // 환경 변수 확인
  const hasSpotifyConfig = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null; // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Spotify 계정 연결
            </CardTitle>
            <CardDescription className="text-gray-600">
              음악을 공유하고 다른 사용자들과 연결하세요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!hasSpotifyConfig ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">설정 필요</h3>
                </div>
                <p className="text-sm text-red-800 mb-3">
                  Spotify API 설정이 필요합니다. 환경 변수를 확인해주세요.
                </p>
                <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
                  <code>NEXT_PUBLIC_SPOTIFY_CLIENT_ID</code>가 설정되지 않았습니다.
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 mb-2">연결 시 제공되는 기능</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 현재 재생 중인 음악 자동 공유</li>
                  <li>• 개인 음악 취향 분석</li>
                  <li>• 플레이리스트 기반 스테이션 생성</li>
                  <li>• 음악 DNA 시각화</li>
                  <li>• 실시간 음악 파도타기</li>
                </ul>
              </div>
            )}

            <Button 
              onClick={handleSpotifyLogin}
              disabled={!hasSpotifyConfig}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Music className="w-5 h-5 mr-2" />
              Spotify로 계속하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="text-center">
              <button 
                onClick={() => router.push('/')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                나중에 하기
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
