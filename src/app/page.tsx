'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Music, Radio, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';


export default function HomePage() {
  const { user, profile, loading, signInWithGoogle, signOutApp } = useAuth();

  return (
    <MainLayout showTabs={true}>
      <div className="p-6 space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-neumorphism mb-4">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient">Arch1ve</h1>
          <p className="text-surface-600 text-lg">
            실시간 음악 공유와 커뮤니티 트렌드를 통한<br />
            새로운 음악 발견 플랫폼
          </p>
        </div>

        {/* 기능 소개 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wave className="w-5 h-5 text-primary-500" />
                Wave 피드
              </CardTitle>
              <CardDescription>
                실시간으로 듣고 있는 음악을 공유하고 다른 사용자들의 음악을 발견하세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary-500" />
                스테이션
              </CardTitle>
              <CardDescription>
                유튜브 플레이리스트를 구독하고 관리하여 나만의 음악 스테이션을 만들어보세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                차트
              </CardTitle>
              <CardDescription>
                커뮤니티 투표를 통해 주간 테마 플레이리스트에 참여하고 우승자를 발표하세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary-500" />
                음악 DNA
              </CardTitle>
              <CardDescription>
                개인의 음악 취향을 시각화하고 통계를 통해 음악 정체성을 파악하세요
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 인증 상태 */}
        <div className="space-y-4">
          {loading ? (
            <Button className="w-full" size="lg" disabled>로딩 중...</Button>
          ) : user ? (
            <div className="space-y-3">
              <div className="text-sm text-surface-600">반가워요, {profile?.displayName || user.email} 님</div>
              {!((profile as { spotifyConnected?: boolean })?.spotifyConnected) ? (
                <Link href="/auth/spotify">
                  <Button className="w-full" size="lg">Spotify 계정 연결</Button>
                </Link>
              ) : (
                <div className="text-center">
                  <p className="text-green-600 mb-4">✅ Spotify 연결 완료!</p>
                  <p className="text-sm text-surface-600 mb-4">이제 앱의 모든 기능을 사용할 수 있습니다.</p>
                </div>
              )}
              <Button className="w-full" size="md" variant="ghost" onClick={signOutApp}>로그아웃</Button>
            </div>
          ) : (
            <Button className="w-full" size="lg" onClick={signInWithGoogle}>
              Google로 시작하기
            </Button>
          )}
          <p className="text-center text-sm text-surface-500">
            Spotify 계정 연결이 필요합니다
          </p>
        </div>

        {/* 디자인 철학 */}
        <Card variant="neumorphism">
          <CardHeader>
            <CardTitle className="text-center">디자인 철학</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-surface-600">
                <strong>미니멀리즘:</strong> 디터 람스의 설계 원칙을 적용한 깔끔한 인터페이스
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-surface-600">
                <strong>턴테이블 메타포:</strong> LP 레코드처럼 원형으로 디자인된 음악 카드
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-surface-600">
                <strong>뉴모피즘:</strong> 부드러운 그림자와 깊이감으로 물리적 은유 구현
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

// Wave 아이콘 컴포넌트 (lucide-react에 없으므로 임시로 생성)
const Wave: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
