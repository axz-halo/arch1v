import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required for security validation' },
        { status: 400 }
      );
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Spotify credentials not configured' },
        { status: 500 }
      );
    }

    // 환경에 따른 Redirect URI 결정
    const isDevelopment = process.env.NODE_ENV === 'development';
    const host = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    
    let redirectUri: string;
    if (isDevelopment && (host.includes('localhost') || host.includes('127.0.0.1'))) {
      // 개발 환경에서는 127.0.0.1 사용 (localhost 대신)
      const port = host.split(':')[1] || '3000';
      redirectUri = `http://127.0.0.1:${port}/auth/spotify/callback`;
    } else {
      // 프로덕션 환경에서는 HTTPS 사용
      redirectUri = `${protocol}://${host}/auth/spotify/callback`;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Spotify token exchange error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange token' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope,
      refresh_token: data.refresh_token,
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
