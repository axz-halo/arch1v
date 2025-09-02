'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return '서버 설정에 문제가 있습니다. 관리자에게 문의하세요.';
      case 'AccessDenied':
        return '접근이 거부되었습니다. 권한을 확인해주세요.';
      case 'Verification':
        return '인증에 실패했습니다. 다시 시도해주세요.';
      case 'Default':
      default:
        return '인증 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              인증 오류
            </CardTitle>
            <CardDescription className="text-gray-600">
              {getErrorMessage(error)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">오류 코드</h3>
              </div>
              <p className="text-sm text-red-800">
                {error || 'Unknown Error'}
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/spotify">
                <Button className="w-full">
                  다시 시도하기
                </Button>
              </Link>
              
              <Link href="/">
                <Button className="w-full" variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
