"use client";

import React, { useCallback } from 'react';
import Button from '@/components/ui/Button';
import { getSpotifyAuthorizeUrl } from '@/lib/spotify';

export default function SpotifyConnectPage() {
  const onConnect = useCallback(() => {
    const url = getSpotifyAuthorizeUrl();
    window.location.href = url;
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Spotify 연결</h1>
      <p className="text-surface-600 mb-6">계정을 연결하여 청취 기록과 재생 제어 기능을 사용할 수 있어요.</p>
      <Button onClick={onConnect} size="lg" className="w-full">Spotify 계정 연결</Button>
    </div>
  );
}
