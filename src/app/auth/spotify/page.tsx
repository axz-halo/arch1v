'use client';

import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Music, ArrowRight } from 'lucide-react';

export default function SpotifyAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 이미 인증된 사용자는 앱으로 리다이렉트
    if (status === 'authenticated') {
      router.push('/app');
    }
  }, [session, status, router]);

  const handleSpotifyLogin = () => {
    signIn('spotify', { callbackUrl: '/app' });
  };

  // 로딩 상태
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // 이미 인증된 사용자
  if (status === 'authenticated') {
    return null; // 리다이렉트 처리됨
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
              Spotify로 로그인
            </CardTitle>
            <CardDescription className="text-gray-600">
              Spotify 계정을 연동하여 음악을 공유하고 발견하세요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? (
              <>
                <Button 
                  onClick={handleSpotifyLogin}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg"
                >
                  <Music className="w-5 h-5 mr-2" />
                  Spotify로 시작하기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">연동 시 제공되는 기능</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 현재 재생 중인 음악 자동 공유</li>
                    <li>• 개인 음악 취향 분석</li>
                    <li>• 플레이리스트 기반 스테이션 생성</li>
                    <li>• 음악 DNA 시각화</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <h3 className="font-semibold text-yellow-900">설정 필요</h3>
                  </div>
                  <p className="text-sm text-yellow-800 mb-3">
                    Spotify API 설정이 필요합니다. 환경 변수를 확인해주세요.
                  </p>
                  <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                    <code>NEXT_PUBLIC_SPOTIFY_CLIENT_ID</code>가 설정되지 않았습니다.
                  </div>
                </div>
                <Button className="w-full" disabled>
                  Spotify로 시작하기 (설정 필요)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
