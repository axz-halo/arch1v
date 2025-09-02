import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getServerSession } from 'next-auth';

// 스테이션 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, coverImage, type, source, sourceId, tracks, isPublic, tags } = body;

    // 인증 확인 (실제로는 NextAuth 또는 Firebase Auth 사용)
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const stationData = {
      name,
      description,
      coverImage,
      type,
      source,
      sourceId,
      tracks: tracks || [],
      isPublic: isPublic ?? true,
      tags: tags || [],
      creatorId: 'temp-user-id', // 실제로는 session.user.id
      creator: {
        id: 'temp-user-id',
        displayName: 'Temp User',
        photoURL: null,
      },
      subscribers: [],
      subscriberCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      playCount: 0,
    };

    const docRef = await addDoc(collection(db, 'stations'), stationData);

    return NextResponse.json({
      id: docRef.id,
      ...stationData,
    });
  } catch (error) {
    console.error('Station creation error:', error);
    return NextResponse.json({ error: 'Failed to create station' }, { status: 500 });
  }
}

// 스테이션 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const creatorId = searchParams.get('creatorId');
    const isPublic = searchParams.get('isPublic');
    const limitCount = parseInt(searchParams.get('limit') || '20');

    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    let q = query(collection(db, 'stations'), orderBy('createdAt', 'desc'), limit(limitCount));

    if (type) {
      q = query(q, where('type', '==', type));
    }
    if (creatorId) {
      q = query(q, where('creatorId', '==', creatorId));
    }
    if (isPublic !== null) {
      q = query(q, where('isPublic', '==', isPublic === 'true'));
    }

    const snapshot = await getDocs(q);
    const stations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Station fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch stations' }, { status: 500 });
  }
}
