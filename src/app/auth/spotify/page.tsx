'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Music, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SpotifyAuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // 로그인되지 않은 사용자는 홈으로 리다이렉트
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/spotify/callback`;
    const scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read playlist-read-private playlist-read-collaborative';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;
    
    window.location.href = authUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
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

            <Button 
              onClick={handleSpotifyLogin}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
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
