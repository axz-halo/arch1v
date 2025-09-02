"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Music, Check, AlertCircle } from 'lucide-react';

function SpotifyCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const code = params.get('code');
    const err = params.get('error');
    
    if (err) {
      setError(err);
      return;
    }
    
    if (!code) {
      setError('인증 코드가 없습니다.');
      return;
    }

    const run = async () => {
      try {
        // Spotify 토큰 교환
        const res = await fetch('/api/spotify/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '토큰 교환에 실패했습니다.');

        // Spotify 사용자 정보 가져오기
        const userRes = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
          },
        });
        
        if (!userRes.ok) throw new Error('Spotify 사용자 정보를 가져올 수 없습니다.');
        const spotifyUser = await userRes.json();

        // Firebase에 사용자 정보 저장
        if (!db) throw new Error('Firebase 데이터베이스가 초기화되지 않았습니다.');
        
        const userId = `spotify_${spotifyUser.id}`;
        const userRef = doc(db, 'users', userId);
        
        const userDoc = await getDoc(userRef);
        let userInfo;
        
        if (userDoc.exists()) {
          // 기존 사용자 업데이트
          userInfo = {
            ...userDoc.data(),
            spotifyConnected: true,
            spotify: {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresIn: data.expires_in,
              tokenType: data.token_type,
              scope: data.scope,
              connectedAt: new Date(),
            },
            updatedAt: new Date(),
          };
        } else {
          // 새 사용자 생성
          userInfo = {
            id: userId,
            email: spotifyUser.email,
            displayName: spotifyUser.display_name,
            photoURL: spotifyUser.images?.[0]?.url,
            spotifyId: spotifyUser.id,
            spotifyConnected: true,
            spotify: {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresIn: data.expires_in,
              tokenType: data.token_type,
              scope: data.scope,
              connectedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            followers: 0,
            following: 0,
            waveCount: 0,
          };
        }
        
        await setDoc(userRef, userInfo);
        setUserData(userInfo);
        setSuccess(true);
        
        // 2초 후 온보딩 페이지로 이동
        setTimeout(() => router.push('/onboarding'), 2000);
        
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
      }
    };

    run();
  }, [params, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              연결 실패
            </CardTitle>
            <CardDescription className="text-gray-600">
              Spotify 계정 연결 중 문제가 발생했습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
            >
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              연결 완료!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Spotify 계정이 성공적으로 연결되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                {userData?.photoURL && (
                  <img 
                    src={userData.photoURL} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-green-900">{userData?.displayName}</p>
                  <p className="text-sm text-green-700">{userData?.email}</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">온보딩 페이지로 이동 중...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            연결 중...
          </CardTitle>
          <CardDescription className="text-gray-600">
            Spotify 계정을 연결하고 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SpotifyCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      <SpotifyCallbackContent />
    </Suspense>
  );
}
