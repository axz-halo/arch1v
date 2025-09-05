'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGestures } from '@/hooks/useGestures';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  threshold?: number; // 새로고침 임계값 (기본 80px)
  className?: string;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  className,
  disabled = false,
  hapticFeedback = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canRefresh, setCanRefresh] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const { attachGestures, detachGestures, triggerHaptic } = useGestures({
    onDragStart: (state) => {
      if (disabled || isRefreshing) return;
      
      // 스크롤이 맨 위에 있을 때만 풀 투 리프레시 활성화
      if (containerRef.current?.scrollTop === 0) {
        setStartY(state.startY);
        setIsPulling(true);
      }
    },
    onDrag: (state) => {
      if (disabled || isRefreshing || !isPulling) return;
      
      // 위쪽으로 드래그할 때만 처리
      if (state.deltaY < 0) {
        const distance = Math.abs(state.deltaY);
        const maxDistance = threshold * 1.5; // 최대 드래그 거리
        const clampedDistance = Math.min(distance, maxDistance);
        
        setPullDistance(clampedDistance);
        setCanRefresh(clampedDistance >= threshold);
        
        // 임계값 도달 시 햅틱 피드백
        if (clampedDistance >= threshold && !canRefresh && hapticFeedback) {
          triggerHaptic('light');
        }
      }
    },
    onDragEnd: () => {
      if (disabled || isRefreshing || !isPulling) return;
      
      setIsPulling(false);
      
      if (canRefresh) {
        handleRefresh();
      } else {
        // 임계값에 도달하지 않으면 원래 위치로 복귀
        setPullDistance(0);
        setCanRefresh(false);
      }
    },
  });

  const handleRefresh = async () => {
    if (disabled || isRefreshing) return;
    
    setIsRefreshing(true);
    setCanRefresh(false);
    
    if (hapticFeedback) {
      triggerHaptic('medium');
    }
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('새로고침 실패:', error);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      attachGestures(containerRef.current);
    }

    return () => {
      detachGestures();
    };
  }, [attachGestures, detachGestures]);

  const refreshIconRotation = isRefreshing ? 360 : (pullDistance / threshold) * 180;
  const refreshIconScale = Math.min(1 + (pullDistance / threshold) * 0.2, 1.2);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-auto',
        className
      )}
    >
      {/* 새로고침 인디케이터 */}
      <div
        className={cn(
          'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full transition-all duration-200 ease-out',
          'flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200',
          isPulling || isRefreshing ? 'translate-y-4' : 'translate-y-0'
        )}
        style={{
          transform: `translateX(-50%) translateY(${isPulling || isRefreshing ? '1rem' : '-100%'})`,
        }}
      >
        <RefreshCw
          className={cn(
            'w-6 h-6 text-primary-500 transition-all duration-200',
            isRefreshing && 'animate-spin',
            canRefresh && !isRefreshing && 'text-green-500'
          )}
          style={{
            transform: `rotate(${refreshIconRotation}deg) scale(${refreshIconScale})`,
          }}
        />
      </div>

      {/* 풀 투 리프레시 힌트 */}
      {isPulling && pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary-50 to-transparent transition-opacity duration-200"
          style={{
            height: `${Math.min(pullDistance, threshold * 1.5)}px`,
            opacity: Math.min(pullDistance / threshold, 1),
          }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-sm font-medium text-primary-600 mb-1">
                {canRefresh ? '놓으면 새로고침' : '더 당겨서 새로고침'}
              </div>
              <div className="text-xs text-primary-500">
                {Math.round((pullDistance / threshold) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 컨텐츠 */}
      <div
        className={cn(
          'transition-transform duration-200 ease-out',
          isPulling && 'transform'
        )}
        style={{
          transform: `translateY(${Math.min(pullDistance * 0.5, threshold * 0.5)}px)`,
        }}
      >
        {children}
      </div>

      {/* 새로고침 중 오버레이 */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-lg">
            <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm font-medium text-gray-700">새로고침 중...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PullToRefresh;
