import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, redirectUri } = await req.json();
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = redirectUri || process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirect_uri) {
      return NextResponse.json({ error: 'Spotify env not configured' }, { status: 500 });
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basic}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
    });

    const data = await tokenRes.json();
    if (!tokenRes.ok) {
      return NextResponse.json({ error: data.error_description || 'Exchange failed' }, { status: tokenRes.status });
    }

    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      scope: data.scope,
      token_type: data.token_type,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
