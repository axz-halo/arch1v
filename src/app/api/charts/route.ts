import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

// 차트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, theme, period, startDate, endDate, votingEndDate } = body;

    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const chartData = {
      title,
      description,
      theme,
      period,
      status: 'voting' as const,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      votingEndDate: new Date(votingEndDate),
      tracks: [],
      participants: [],
      participantCount: 0,
      totalVotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'temp-admin-id', // 실제로는 인증된 관리자 ID
    };

    const docRef = await addDoc(collection(db, 'charts'), chartData);

    return NextResponse.json({
      id: docRef.id,
      ...chartData,
    });
  } catch (error) {
    console.error('Chart creation error:', error);
    return NextResponse.json({ error: 'Failed to create chart' }, { status: 500 });
  }
}

// 차트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const period = searchParams.get('period');
    const limitCount = parseInt(searchParams.get('limit') || '10');

    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    let q = query(collection(db, 'charts'), orderBy('createdAt', 'desc'), limit(limitCount));

    if (status) {
      q = query(q, where('status', '==', status));
    }
    if (period) {
      q = query(q, where('period', '==', period));
    }

    const snapshot = await getDocs(q);
    const charts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(charts);
  } catch (error) {
    console.error('Chart fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch charts' }, { status: 500 });
  }
}
