"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MainLayout from '@/components/layout/MainLayout';

export default function AppPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 인증되지 않은 사용자는 홈으로 리다이렉트
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    // 로딩 중이면 대기
    if (status === 'loading') {
      return;
    }
  }, [session, status, router]);

  // 로딩 상태
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // 인증되지 않은 사용자
  if (status === 'unauthenticated') {
    return null; // 리다이렉트 처리됨
  }

  return <MainLayout showTabs={true} />;
}
