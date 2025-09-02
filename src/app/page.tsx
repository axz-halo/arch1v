'use client';

import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Music, Radio, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { user, profile, loading, signOutApp } = useAuth();
  const { data: session, status } = useSession();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 헤더 */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg mb-6">
            <Music className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
            Arch1ve
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            실시간 음악 공유와 커뮤니티 트렌드를 통한<br />
            새로운 음악 발견 플랫폼
          </p>
        </div>

        {/* 기능 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Music className="w-6 h-6 text-primary-500" />
                Wave 피드
              </CardTitle>
              <CardDescription className="text-base">
                실시간으로 듣고 있는 음악을 공유하고 다른 사용자들의 음악을 발견하세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Radio className="w-6 h-6 text-primary-500" />
                스테이션
              </CardTitle>
              <CardDescription className="text-base">
                플레이리스트를 구독하고 관리하여 나만의 음악 스테이션을 만들어보세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <TrendingUp className="w-6 h-6 text-primary-500" />
                차트
              </CardTitle>
              <CardDescription className="text-base">
                커뮤니티 투표를 통해 주간 테마 플레이리스트에 참여하고 우승자를 발표하세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Heart className="w-6 h-6 text-primary-500" />
                음악 DNA
              </CardTitle>
              <CardDescription className="text-base">
                개인의 음악 취향을 시각화하고 통계를 통해 음악 정체성을 파악하세요
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 인증 상태 */}
        <div className="max-w-md mx-auto">
          {status === 'loading' || loading ? (
            <Button className="w-full" size="lg" disabled>로딩 중...</Button>
          ) : session ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 mb-2">
                  반가워요, {session.spotifyProfile?.display_name || session.user?.email} 님
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-green-600 mb-4 text-lg">✅ Spotify 연결 완료!</p>
                    <p className="text-sm text-gray-600 mb-4">이제 앱의 모든 기능을 사용할 수 있습니다.</p>
                    <Link href="/onboarding">
                      <Button className="w-full" size="lg">계정 설정하기</Button>
                    </Link>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="md" 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? (
                <>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => signIn('spotify', { callbackUrl: '/onboarding' })}
                  >
                    <Music className="w-5 h-5 mr-2" />
                    Spotify로 시작하기
                  </Button>
                  <p className="text-center text-sm text-gray-500">
                    Spotify 계정으로 로그인하여 음악을 공유하세요
                  </p>
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
                  <Button className="w-full" size="lg" disabled>
                    Spotify로 시작하기 (설정 필요)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
