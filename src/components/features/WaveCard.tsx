'use client';

import React from 'react';
import { Wave } from '@/types';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { Play, Heart, MessageCircle, Share2, Music, User } from 'lucide-react';
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
    return wave.reactions.some(r => r.type === type);
  };

  const spotifyUri = wave.track.platformId ? `spotify:track:${wave.track.platformId}` : null;

  return (
    <div 
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onWaveSelect?.(wave)}
    >
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{wave.user.displayName}</p>
          <p className="text-sm text-gray-500">{formatRelativeTime(wave.timestamp)}</p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
          파도타기
        </div>
      </div>

      {/* Track Info */}
      <div className="flex gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
          <Image
            src={wave.track.albumArt}
            alt={wave.track.album}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority={priority}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button 
              onClick={handlePlay}
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Play className="w-4 h-4 text-gray-900 ml-0.5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{wave.track.title}</h3>
          <p className="text-gray-600 mb-2">{wave.track.artist}</p>
          <p className="text-sm text-gray-500">{wave.track.album}</p>
        </div>
      </div>

      {/* Wave Message */}
      {wave.message && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">{wave.message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              hasUserReacted('like') 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleReaction('like')}
          >
            <Heart className={`w-4 h-4 ${hasUserReacted('like') ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{formatNumber(getReactionCount('like'))}</span>
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
            onClick={handleComment}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{formatNumber(wave.comments.length)}</span>
          </button>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">공유</span>
          </button>
        </div>
        
        {spotifyUri && (
          <SpotifyUriButton 
            uri={spotifyUri} 
            size="sm" 
            variant="ghost"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200"
          >
            <Music className="w-4 h-4" />
            <span className="text-sm font-medium">Spotify</span>
          </SpotifyUriButton>
        )}
      </div>
    </div>
  );
};

export default WaveCard;
