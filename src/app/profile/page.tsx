'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Settings, Music, Heart, Share2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 인증되지 않은 사용자는 홈으로 리다이렉트
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  // 로딩 상태
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/app')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">프로필</h1>
          </div>
          <div className="text-sm text-gray-500">
            {session?.spotifyProfile?.display_name || '사용자'}님
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-4">
              {session?.spotifyProfile?.images?.[0]?.url ? (
                <img 
                  src={session.spotifyProfile.images[0].url} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{session?.spotifyProfile?.display_name || '사용자'}</h2>
                <p className="text-gray-200">{session?.spotifyProfile?.email}</p>
                <p className="text-sm text-gray-300 mt-1">Spotify 계정 연동됨</p>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">1,234</div>
              <div className="text-sm text-gray-600">총 공유</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">567</div>
              <div className="text-sm text-gray-600">팔로워</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">89</div>
              <div className="text-sm text-gray-600">팔로잉</div>
            </div>
          </div>

          {/* Music DNA */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-primary-500" />
              음악 DNA
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">K-Pop</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pop</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rock</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hip-Hop</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="space-y-3">
            <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-medium">설정</span>
              </div>
            </button>
            <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-gray-500" />
                <span className="font-medium">좋아요한 음악</span>
              </div>
            </button>
            <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-gray-500" />
                <span className="font-medium">공유한 음악</span>
              </div>
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-500">로그아웃</span>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
