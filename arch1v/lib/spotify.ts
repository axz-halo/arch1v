import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import { setSecureItem, getSecureItem, deleteSecureItem } from './secure-store';

const SPOTIFY_SCOPES = [
	'user-read-email',
	'user-read-private',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'playlist-read-private',
	'playlist-modify-public',
	'playlist-modify-private',
].join(' ');

const TOKEN_KEY = 'spotify_token';
const REFRESH_KEY = 'spotify_refresh_token';
const EXPIRY_KEY = 'spotify_token_expiry';

export type SpotifyAuthResult = {
	accessToken: string;
	refreshToken?: string;
	expiresAt?: number;
};

export async function authorizeSpotifyWithPKCE(): Promise<SpotifyAuthResult | null> {
	const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID || '';
	const redirectUri = makeRedirectUri({ scheme: 'arch1v', useProxy: true });

	const discovery = {
		authorizationEndpoint: 'https://accounts.spotify.com/authorize',
		tokenEndpoint: 'https://accounts.spotify.com/api/token',
	};

	const request = new AuthSession.AuthRequest({
		clientId,
		redirectUri,
		scopes: SPOTIFY_SCOPES.split(' '),
		usePKCE: true,
		responseType: AuthSession.ResponseType.Code,
		extraParams: { show_dialog: 'true' },
	});

	await request.makeAuthUrlAsync(discovery);
	const result = await request.promptAsync(discovery, { useProxy: true });
	if (result.type !== 'success' || !result.params.code) return null;

	const body = new URLSearchParams({
		client_id: clientId,
		grant_type: 'authorization_code',
		code: result.params.code,
		redirect_uri: redirectUri,
		code_verifier: request.codeVerifier!,
	});

	const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: body.toString(),
	});
	const json = await tokenResponse.json();
	if (!tokenResponse.ok) throw new Error(JSON.stringify(json));

	const expiresAt = Date.now() + (json.expires_in ? json.expires_in * 1000 : 3600 * 1000);
	await setSecureItem(TOKEN_KEY, json.access_token);
	if (json.refresh_token) await setSecureItem(REFRESH_KEY, json.refresh_token);
	await setSecureItem(EXPIRY_KEY, String(expiresAt));

	return { accessToken: json.access_token, refreshToken: json.refresh_token, expiresAt };
}

export async function getValidSpotifyAccessToken(): Promise<string | null> {
	const token = await getSecureItem(TOKEN_KEY);
	const expiry = await getSecureItem(EXPIRY_KEY);
	if (token && expiry && Date.now() < Number(expiry) - 60000) {
		return token;
	}
	const refreshToken = await getSecureItem(REFRESH_KEY);
	if (!refreshToken) return null;
	return refreshSpotifyToken(refreshToken);
}

export async function refreshSpotifyToken(refreshToken: string): Promise<string | null> {
	const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID || '';
	const params = new URLSearchParams({
		client_id: clientId,
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	});
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params.toString(),
	});
	const json = await res.json();
	if (!res.ok) return null;
	const expiresAt = Date.now() + (json.expires_in ? json.expires_in * 1000 : 3600 * 1000);
	await setSecureItem(TOKEN_KEY, json.access_token);
	await setSecureItem(EXPIRY_KEY, String(expiresAt));
	return json.access_token as string;
}

export async function disconnectSpotify() {
	await deleteSecureItem(TOKEN_KEY);
	await deleteSecureItem(REFRESH_KEY);
	await deleteSecureItem(EXPIRY_KEY);
}

