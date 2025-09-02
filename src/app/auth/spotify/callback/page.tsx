"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Button from '@/components/ui/Button';

export default function SpotifyCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const code = params.get('code');
    const err = params.get('error');
    if (err) {
      setError(err);
      return;
    }
    if (!code) return;

    const run = async () => {
      try {
        const res = await fetch('/api/spotify/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to get token');

        if (!user) throw new Error('Not signed in');
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          spotifyConnected: true,
          spotify: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            tokenType: data.token_type,
            scope: data.scope,
            connectedAt: new Date(),
          },
        });
        setSuccess(true);
        setTimeout(() => router.push('/'), 1200);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(errorMessage);
      }
    };

    run();
  }, [params, user, router]);

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">Spotify 연결 실패: {error}</p>
        <Button onClick={() => router.push('/')}>홈으로 이동</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {success ? (
        <p className="text-green-600">Spotify 연결 완료! 이동 중...</p>
      ) : (
        <p>Spotify 연결 처리 중...</p>
      )}
    </div>
  );
}
