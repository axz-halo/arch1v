import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

export default function Home() {
	return (
		<View className="flex-1 items-center justify-center bg-paper">
			<Text className="text-2xl font-semibold text-ink">Arch1v</Text>
			<Text className="text-ink/60">React Native + Expo Router</Text>
			<View className="h-4" />
			<Link href="/(tabs)" className="text-accent">Enter</Link>
			<StatusBar style="auto" />
		</View>
	);
}

