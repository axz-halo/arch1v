import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

// 차트 투표
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { chartId } = params;
    const body = await request.json();
    const { trackId, vote, userId } = body; // vote: 'like' | 'dislike'

    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const chartRef = doc(db, 'charts', chartId);
    const chartDoc = await getDoc(chartRef);

    if (!chartDoc.exists()) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    const chartData = chartDoc.data();
    const tracks = chartData.tracks || [];
    const trackIndex = tracks.findIndex((track: any) => track.id === trackId);

    if (trackIndex === -1) {
      return NextResponse.json({ error: 'Track not found in chart' }, { status: 404 });
    }

    // 투표 처리
    const track = tracks[trackIndex];
    const hasVoted = track.voters?.includes(userId);

    if (hasVoted) {
      return NextResponse.json({ error: 'Already voted' }, { status: 400 });
    }

    // 투표 업데이트
    const updatedTracks = [...tracks];
    updatedTracks[trackIndex] = {
      ...track,
      votes: track.votes + 1,
      voters: [...(track.voters || []), userId],
    };

    // 차트 업데이트
    await updateDoc(chartRef, {
      tracks: updatedTracks,
      totalVotes: increment(1),
      participants: arrayUnion(userId),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      track: updatedTracks[trackIndex],
    });
  } catch (error) {
    console.error('Chart vote error:', error);
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}
