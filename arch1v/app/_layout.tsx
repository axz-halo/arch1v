import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

export default function RootLayout() {
	useEffect(() => {
		// noop placeholder for future splash/font loading
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(auth)/login" />
				<Stack.Screen name="(tabs)" />
			</Stack>
		</GestureHandlerRootView>
	);
}

