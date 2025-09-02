'use client';

import React from 'react';
import { useSpotify } from '@/hooks/useSpotify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import SpotifyUriButton from '@/components/ui/SpotifyUriButton';
import Image from 'next/image';

const CurrentTrackCard: React.FC = () => {
  const { currentTrack, loading, error } = useSpotify();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            현재 재생 중
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            현재 재생 중
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentTrack) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            현재 재생 중
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">현재 재생 중인 트랙이 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">Spotify에서 음악을 재생해보세요</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-green-500" />
          현재 재생 중
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* 앨범 아트 */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <Image
              src={currentTrack.album.images[0]?.url || '/default-album-art.jpg'}
              alt={currentTrack.album.name}
              fill
              className="object-cover"
            />
          </div>

          {/* 트랙 정보 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{currentTrack.name}</h3>
            <p className="text-gray-600 truncate">
              {currentTrack.artists.map(artist => artist.name).join(', ')}
            </p>
            <p className="text-sm text-gray-500 truncate">{currentTrack.album.name}</p>
          </div>

          {/* 컨트롤 버튼들 */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Play className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Spotify에서 열기 버튼 */}
        <div className="mt-4 flex justify-between items-center">
          <SpotifyUriButton 
            uri={currentTrack.uri} 
            size="sm" 
            variant="secondary"
          >
            Spotify에서 열기
          </SpotifyUriButton>
          <span className="text-sm text-gray-500">
            {formatDuration(currentTrack.duration_ms)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentTrackCard;
