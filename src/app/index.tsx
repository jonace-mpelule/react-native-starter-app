import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ActivityIndicator, View } from 'react-native';
export default function Page() {
	return (
		<View className="flex justify-center align-items-center h-screen">
			<Stack.Screen options={{ headerShown: false }} />
			<StatusBar style="light" />
			<ActivityIndicator size="small" color={'white'} />
		</View>
	);
}

