'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface GestureState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchGesture {
  scale: number;
  centerX: number;
  centerY: number;
  distance: number;
}

export interface GestureCallbacks {
  onSwipe?: (gesture: SwipeGesture) => void;
  onPinch?: (gesture: PinchGesture) => void;
  onTap?: (event: TouchEvent) => void;
  onLongPress?: (event: TouchEvent) => void;
  onDragStart?: (state: GestureState) => void;
  onDrag?: (state: GestureState) => void;
  onDragEnd?: (state: GestureState) => void;
}

export const useGestures = (callbacks: GestureCallbacks = {}) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocityX: 0,
    velocityY: 0,
    direction: null,
  });

  const startTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  // 햅틱 피드백 함수
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // 방향 계산
  const calculateDirection = useCallback((deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' | null => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  // 속도 계산
  const calculateVelocity = useCallback((delta: number, deltaTime: number): number => {
    return deltaTime > 0 ? delta / deltaTime : 0;
  }, []);

  // 스와이프 감지
  const detectSwipe = useCallback((state: GestureState, duration: number): SwipeGesture | null => {
    const minDistance = 50; // 최소 스와이프 거리
    const minVelocity = 0.3; // 최소 스와이프 속도
    
    const distance = Math.sqrt(state.deltaX ** 2 + state.deltaY ** 2);
    const velocity = distance / duration;
    
    if (distance >= minDistance && velocity >= minVelocity) {
      const direction = calculateDirection(state.deltaX, state.deltaY);
      
      if (direction) {
        return {
          direction,
          distance,
          velocity,
          duration,
        };
      }
    }
    
    return null;
  }, [calculateDirection]);

  // 핀치 감지
  const detectPinch = useCallback((touches: TouchList): PinchGesture | null => {
    if (touches.length !== 2) return null;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const distance = Math.sqrt(
      (touch2.clientX - touch1.clientX) ** 2 + 
      (touch2.clientY - touch1.clientY) ** 2
    );
    
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    return {
      scale: 1, // 초기 스케일은 1로 설정
      centerX,
      centerY,
      distance,
    };
  }, []);

  // 터치 시작
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    const now = Date.now();
    
    startTimeRef.current = now;
    lastTimeRef.current = now;
    lastXRef.current = touch.clientX;
    lastYRef.current = touch.clientY;
    
    const newState: GestureState = {
      isDragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      direction: null,
    };
    
    setGestureState(newState);
    callbacks.onDragStart?.(newState);
    
    // 롱프레스 타이머 설정
    longPressTimerRef.current = setTimeout(() => {
      callbacks.onLongPress?.(event);
      triggerHaptic('heavy');
    }, 500);
    
    // 기본 동작 방지
    event.preventDefault();
  }, [callbacks, triggerHaptic]);

  // 터치 이동
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!gestureState.isDragging) return;
    
    const touch = event.touches[0];
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    
    const deltaX = touch.clientX - gestureState.startX;
    const deltaY = touch.clientY - gestureState.startY;
    const velocityX = calculateVelocity(touch.clientX - lastXRef.current, deltaTime);
    const velocityY = calculateVelocity(touch.clientY - lastYRef.current, deltaTime);
    
    const newState: GestureState = {
      ...gestureState,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX,
      deltaY,
      velocityX,
      velocityY,
      direction: calculateDirection(deltaX, deltaY),
    };
    
    setGestureState(newState);
    callbacks.onDrag?.(newState);
    
    // 롱프레스 타이머 취소 (드래그가 시작되면)
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    lastTimeRef.current = now;
    lastXRef.current = touch.clientX;
    lastYRef.current = touch.clientY;
    
    // 기본 동작 방지
    event.preventDefault();
  }, [gestureState, callbacks, calculateVelocity, calculateDirection]);

  // 터치 종료
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!gestureState.isDragging) return;
    
    const duration = Date.now() - startTimeRef.current;
    
    // 스와이프 감지
    const swipe = detectSwipe(gestureState, duration);
    if (swipe) {
      callbacks.onSwipe?.(swipe);
      triggerHaptic('medium');
    } else {
      // 탭 감지 (짧은 터치)
      if (duration < 200 && Math.abs(gestureState.deltaX) < 10 && Math.abs(gestureState.deltaY) < 10) {
        callbacks.onTap?.(event);
        triggerHaptic('light');
      }
    }
    
    callbacks.onDragEnd?.(gestureState);
    
    // 상태 초기화
    setGestureState({
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      direction: null,
    });
    
    // 롱프레스 타이머 정리
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // 기본 동작 방지
    event.preventDefault();
  }, [gestureState, callbacks, detectSwipe, triggerHaptic]);

  // 핀치 이벤트 처리
  const handleTouchMoveMulti = useCallback((event: TouchEvent) => {
    if (event.touches.length === 2) {
      const pinch = detectPinch(event.touches);
      if (pinch) {
        callbacks.onPinch?.(pinch);
      }
    }
  }, [callbacks, detectPinch]);

  // 이벤트 리스너 등록
  const attachGestures = useCallback((element: HTMLElement) => {
    elementRef.current = element;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchmove', handleTouchMoveMulti, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: false });
  }, [handleTouchStart, handleTouchMove, handleTouchMoveMulti, handleTouchEnd]);

  // 이벤트 리스너 제거
  const detachGestures = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.removeEventListener('touchstart', handleTouchStart);
      elementRef.current.removeEventListener('touchmove', handleTouchMove);
      elementRef.current.removeEventListener('touchmove', handleTouchMoveMulti);
      elementRef.current.removeEventListener('touchend', handleTouchEnd);
      elementRef.current.removeEventListener('touchcancel', handleTouchEnd);
      elementRef.current = null;
    }
  }, [handleTouchStart, handleTouchMove, handleTouchMoveMulti, handleTouchEnd]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      detachGestures();
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [detachGestures]);

  return {
    gestureState,
    attachGestures,
    detachGestures,
    triggerHaptic,
  };
};
