import 'dotenv/config';

export default ({ config }: any) => ({
	...config,
	name: 'arch1v',
	slug: 'arch1v',
	scheme: 'arch1v',
	orientation: 'portrait',
	newArchEnabled: true,
	userInterfaceStyle: 'automatic',
	web: { bundler: 'metro', favicon: './assets/favicon.png' },
	ios: { supportsTablet: true },
	android: {
		edgeToEdge: true,
		adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' },
	},
	extra: {
		spotifyClientId: process.env.SPOTIFY_CLIENT_ID || '6936931bedbe49d8ae448889cf49520a',
		spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'REDACTED',
		firebaseWebApiKey: process.env.FIREBASE_WEB_API_KEY || '',
		eas: { projectId: process.env.EAS_PROJECT_ID },
	},
});

