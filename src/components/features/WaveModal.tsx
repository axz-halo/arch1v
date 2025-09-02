'use client';

import React, { useState } from 'react';
import { Wave } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { X, Play, Pause, Heart, Send } from 'lucide-react';
import Image from 'next/image';

interface WaveModalProps {
  wave: Wave | null;
  isOpen: boolean;
  onClose: () => void;
  onReaction?: (waveId: string, type: 'like' | 'love' | 'fire') => void;
  onComment?: (waveId: string, content: string) => void;
}

const WaveModal: React.FC<WaveModalProps> = ({
  wave,
  isOpen,
  onClose,
  onReaction,
  onComment,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [commentText, setCommentText] = useState('');


  if (!isOpen || !wave) return null;

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    // 실제로는 30초 미리듣기 재생/정지
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment?.(wave.id, commentText.trim());
      setCommentText('');
    }
  };



  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 top-20 bg-white rounded-t-3xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold">Wave 상세</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* 사용자 정보 */}
          <div className="p-6 border-b border-surface-100">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={wave.user.photoURL || '/default-avatar.svg'}
                alt={wave.user.displayName}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-surface-900">{wave.user.displayName}</p>
                <p className="text-sm text-surface-500">{formatRelativeTime(wave.timestamp)}</p>
              </div>
            </div>
          </div>

          {/* 대형 앨범아트 및 플레이어 */}
          <div className="p-6 text-center">
            <div className="relative inline-block mb-6">
              <div className={`w-48 h-48 rounded-full overflow-hidden shadow-lg transition-all duration-300 ${isPlaying ? 'animate-spin' : ''}`}>
                <Image
                  src={wave.track.albumArt}
                  alt={wave.track.album}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* 플레이 버튼 */}
              <button
                onClick={handlePlayToggle}
                className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white" />
                ) : (
                  <Play className="w-12 h-12 text-white ml-1" />
                )}
              </button>

              {/* 바늘 (턴테이블 메타포) */}
              {isPlaying && (
                <div className="absolute -top-2 right-8 w-1 h-24 bg-surface-400 rounded-full transform rotate-12 origin-bottom"></div>
              )}
            </div>

            {/* 트랙 정보 */}
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-surface-900">{wave.track.title}</h3>
              <p className="text-lg text-surface-600">{wave.track.artist}</p>
              <p className="text-surface-500">{wave.track.album}</p>
              
              {/* 미리듣기 진행바 */}
              {isPlaying && (
                <div className="w-full bg-surface-200 rounded-full h-1 mt-4">
                  <div 
                    className="bg-primary-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: '50%' }}
                  ></div>
                </div>
              )}
            </div>

            {/* 반응 버튼들 */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={() => onReaction?.(wave.id, 'like')}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-surface-50 transition-colors"
              >
                <Heart className="w-6 h-6 text-surface-500 hover:text-red-500" />
                <span className="text-xs text-surface-500">좋아요</span>
              </button>
              
              <button
                onClick={() => onReaction?.(wave.id, 'love')}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-surface-50 transition-colors"
              >
                <span className="text-xl">❤️</span>
                <span className="text-xs text-surface-500">사랑해요</span>
              </button>
              
              <button
                onClick={() => onReaction?.(wave.id, 'fire')}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-surface-50 transition-colors"
              >
                <span className="text-xl">🔥</span>
                <span className="text-xs text-surface-500">불타요</span>
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="p-6">
            <h4 className="font-semibold mb-4">댓글 {wave.comments.length}</h4>
            
            {/* 댓글 목록 */}
            <div className="space-y-4 mb-6">
              {wave.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Image
                    src={comment.user.photoURL || '/default-avatar.svg'}
                    alt={comment.user.displayName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-surface-50 rounded-2xl px-4 py-3">
                      <p className="font-medium text-sm text-surface-900 mb-1">
                        {comment.user.displayName}
                      </p>
                      <p className="text-surface-700">{comment.content}</p>
                    </div>
                    <p className="text-xs text-surface-500 mt-1 ml-4">
                      {formatRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 댓글 입력 */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full bg-surface-100 border-0 rounded-xl px-4 py-3 pr-12 shadow-inner focus:shadow-lg transition-all duration-200 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-surface-200 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-primary-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveModal;
