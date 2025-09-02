'use client';

import React from 'react';
import { Wave } from '@/types';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { Play, Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import SpotifyUriButton from '@/components/ui/SpotifyUriButton';

interface WaveCardProps {
  wave: Wave;
  onWaveSelect?: (wave: Wave) => void;
  onReaction?: (waveId: string, type: 'like' | 'love' | 'fire') => void;
  onComment?: (waveId: string) => void;
  onShare?: (waveId: string) => void;
  priority?: boolean;
}

const WaveCard: React.FC<WaveCardProps> = ({
  wave,
  onWaveSelect,
  onReaction,
  onComment,
  onShare,
  priority = false,
}) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 실제로는 재생 로직
    console.log('Playing:', wave.track.title);
  };

  const handleReaction = (type: 'like' | 'love' | 'fire') => {
    onReaction?.(wave.id, type);
  };

  const handleComment = () => {
    onComment?.(wave.id);
  };

  const handleShare = () => {
    onShare?.(wave.id);
  };

  const getReactionCount = (type: 'like' | 'love' | 'fire') => {
    return wave.reactions.filter(r => r.type === type).length;
  };

  const hasUserReacted = (type: 'like' | 'love' | 'fire') => {
    // 실제로는 현재 사용자 ID로 체크
    return wave.reactions.some(r => r.type === type);
  };

  // Spotify URI 생성 (실제로는 트랙 데이터에서 가져와야 함)
  const spotifyUri = wave.track.platformId ? `spotify:track:${wave.track.platformId}` : null;

  return (
    <div className="wave-card" onClick={() => onWaveSelect?.(wave)}>
      <div className="wave-meta">
        <div className="album-art-lp">
          <Image
            src={wave.track.albumArt}
            alt={wave.track.album}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority={priority}
          />
        </div>
        <div className="track-details">
          <h3 className="track-title">{wave.track.title}</h3>
          <p className="track-artist">{wave.track.artist}</p>
          <p className="track-meta">
            {wave.user.displayName} • {formatRelativeTime(wave.timestamp)}
          </p>
        </div>
      </div>
      
      <div className="wave-actions">
        <button className="play-button" onClick={handlePlay}>
          <Play className="w-4 h-4" />
        </button>
        
        {spotifyUri && (
          <SpotifyUriButton 
            uri={spotifyUri} 
            size="sm" 
            variant="ghost"
            className="reaction-btn"
          >
            Spotify
          </SpotifyUriButton>
        )}
        
        <button 
          className={`reaction-btn ${hasUserReacted('like') ? 'active' : ''}`}
          onClick={() => handleReaction('like')}
        >
          <Heart className="w-4 h-4" />
          <span>{formatNumber(getReactionCount('like'))}</span>
        </button>
        
        <button className="reaction-btn" onClick={handleComment}>
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(wave.comments.length)}</span>
        </button>
        
        <button className="reaction-btn" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          <span>공유</span>
        </button>
      </div>
    </div>
  );
};

export default WaveCard;
