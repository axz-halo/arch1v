'use client';

import React from 'react';
import { openSpotifyUri, isValidSpotifyUri } from '@/lib/spotify';
import { Music, ExternalLink } from 'lucide-react';
import Button from './Button';

interface SpotifyUriButtonProps {
  uri: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SpotifyUriButton: React.FC<SpotifyUriButtonProps> = ({
  uri,
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const handleClick = () => {
    if (isValidSpotifyUri(uri)) {
      openSpotifyUri(uri);
    } else {
      console.error('Invalid Spotify URI:', uri);
    }
  };

  if (!isValidSpotifyUri(uri)) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <Music className="w-4 h-4" />
      {children || 'Spotify에서 열기'}
      <ExternalLink className="w-4 h-4" />
    </Button>
  );
};

export default SpotifyUriButton;
