'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGestures, SwipeGesture } from '@/hooks/useGestures';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  disabled?: boolean;
  threshold?: number; // 스와이프 임계값 (기본 100px)
  hapticFeedback?: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  className,
  disabled = false,
  threshold = 100,
  hapticFeedback = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const { attachGestures, detachGestures, triggerHaptic } = useGestures({
    onSwipe: (gesture: SwipeGesture) => {
      if (disabled) return;

      setIsAnimating(true);
      
      if (hapticFeedback) {
        triggerHaptic('medium');
      }

      // 스와이프 방향에 따른 액션 실행
      switch (gesture.direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }

      // 애니메이션 완료 후 상태 초기화
      setTimeout(() => {
        setIsAnimating(false);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
    },
    onTap: () => {
      if (disabled) return;
      
      if (hapticFeedback) {
        triggerHaptic('light');
      }
      
      onTap?.();
    },
    onLongPress: () => {
      if (disabled) return;
      
      if (hapticFeedback) {
        triggerHaptic('heavy');
      }
      
      onLongPress?.();
    },
    onDragStart: () => {
      if (disabled) return;
      setIsDragging(true);
    },
    onDrag: (state) => {
      if (disabled) return;
      
      // 드래그 중일 때 카드 위치 업데이트
      const maxOffset = threshold;
      const offsetX = Math.max(-maxOffset, Math.min(maxOffset, state.deltaX));
      const offsetY = Math.max(-maxOffset, Math.min(maxOffset, state.deltaY));
      
      setDragOffset({ x: offsetX, y: offsetY });
    },
    onDragEnd: () => {
      if (disabled) return;
      setIsDragging(false);
      
      // 임계값을 넘지 않으면 원래 위치로 복귀
      if (Math.abs(dragOffset.x) < threshold && Math.abs(dragOffset.y) < threshold) {
        setIsAnimating(true);
        setTimeout(() => {
          setDragOffset({ x: 0, y: 0 });
          setIsAnimating(false);
        }, 200);
      }
    },
  });

  useEffect(() => {
    if (cardRef.current) {
      attachGestures(cardRef.current);
    }

    return () => {
      detachGestures();
    };
  }, [attachGestures, detachGestures]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative transition-all duration-200 ease-out touch-target-large',
        isDragging && 'scale-105 shadow-xl',
        isAnimating && 'transition-transform duration-300 ease-out',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
      }}
    >
      {children}
      
      {/* 스와이프 힌트 오버레이 */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 좌측 스와이프 힌트 */}
          {dragOffset.x < -threshold * 0.5 && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-80">
              ← 스와이프
            </div>
          )}
          
          {/* 우측 스와이프 힌트 */}
          {dragOffset.x > threshold * 0.5 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-80">
              스와이프 →
            </div>
          )}
          
          {/* 상단 스와이프 힌트 */}
          {dragOffset.y < -threshold * 0.5 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-80">
              ↑ 스와이프
            </div>
          )}
          
          {/* 하단 스와이프 힌트 */}
          {dragOffset.y > threshold * 0.5 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-80">
              ↓ 스와이프
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SwipeableCard;
