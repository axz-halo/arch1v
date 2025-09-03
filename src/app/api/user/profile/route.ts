import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const { displayName, bio } = await request.json();

    // 입력 검증
    if (!displayName || !displayName.trim()) {
      return NextResponse.json(
        { error: '닉네임은 필수입니다.' },
        { status: 400 }
      );
    }

    // 프로필 정보 저장 (실제로는 데이터베이스에 저장)
    // 현재는 세션 정보를 기반으로 임시 저장
    const profileData = {
      userId: session.spotifyId,
      displayName: displayName.trim(),
      bio: bio?.trim() || '',
      spotifyProfile: session.spotifyProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: 실제 데이터베이스 저장 로직 구현
    console.log('프로필 저장:', profileData);

    return NextResponse.json({
      success: true,
      message: '프로필이 성공적으로 저장되었습니다.',
      profile: profileData,
    });

  } catch (error) {
    console.error('프로필 저장 오류:', error);
    return NextResponse.json(
      { error: '프로필 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // TODO: 실제 데이터베이스에서 프로필 정보 조회
    const profileData = {
      userId: session.spotifyId,
      displayName: session.spotifyProfile?.display_name || '',
      bio: '',
      spotifyProfile: session.spotifyProfile,
    };

    return NextResponse.json({
      success: true,
      profile: profileData,
    });

  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return NextResponse.json(
      { error: '프로필 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
