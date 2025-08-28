import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#ff5500' }}>
			<Tabs.Screen name="wave" options={{ title: 'Wave' }} />
			<Tabs.Screen name="stations" options={{ title: 'Stations' }} />
			<Tabs.Screen name="charts" options={{ title: 'Charts' }} />
			<Tabs.Screen name="profile" options={{ title: 'Profile' }} />
		</Tabs>
	);
}

