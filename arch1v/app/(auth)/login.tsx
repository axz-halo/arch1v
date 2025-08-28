import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import { authorizeSpotifyWithPKCE } from '../../lib/spotify';

export default function LoginScreen() {
	const router = useRouter();
	const setSpotifyConnected = useAuthStore((s) => s.setSpotifyConnected);

	return (
		<View className="flex-1 items-center justify-center bg-paper p-6">
			<Text className="text-3xl font-semibold text-ink">Arch1v</Text>
			<Text className="text-ink/60 mt-2">Sign in and connect Spotify</Text>
			<View className="h-6" />
			<Pressable
				className="px-5 py-3 bg-ink rounded-full"
				onPress={async () => {
					try {
						const res = await authorizeSpotifyWithPKCE();
						if (res?.accessToken) {
							setSpotifyConnected(true);
							router.replace('/(tabs)');
						}
					} catch (e) {
						console.warn(e);
					}
				}}
			>
				<Text className="text-white">Connect Spotify</Text>
			</Pressable>
			<View className="h-3" />
			<Pressable
				className="px-5 py-3 border border-ink/20 rounded-full"
				onPress={() => router.replace('/(tabs)')}
			>
				<Text className="text-ink">Skip for now</Text>
			</Pressable>
		</View>
	);
}

