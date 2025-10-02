/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <'because'> */

import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { AuthAPI } from '@/api/auth.api';
import PageScaffold from '@/components/PageScaffold';
import ThemedText from '@/components/ThemedText';
import Strings from '@/constants/strings';
import { useAuthStore } from '@/stores/auth.store';
import { useLoadingState } from '@/stores/loading.store';
import { useThemeMode } from '@/stores/thememode.store';
import { useUserStore } from '@/stores/user.store';
import type { User } from '@/types/user.t';
import { useAuth } from './auth.context';

interface AppContextProps {
	isAppLoading: boolean;
	hasAppError: boolean;
	retryAppLoading: () => Promise<void>;
}

const AppContext = createContext<AppContextProps>({
	isAppLoading: true,
	hasAppError: false,
	retryAppLoading: async () => {},
});

export const useApp = () => {
	return useContext(AppContext);
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [hasError, setHasError] = useState<boolean>(false);

	const auth = useAuth();

	const loadAndSetTheme = async () => {
		try {
			const storedTheme = await SecureStore.getItemAsync(Strings.THEME_STORE_KEY);
			if (storedTheme) {
				const themeValue = storedTheme === 'dark' ? 'dark' : 'light';
				useThemeMode.setState({ theme: themeValue });
			}
		} catch (error) {
			console.error('Error loading theme:', error);
		}
	};

	const loadUserData = async () => {
		if (!auth.authState?.authenticated) {
			return;
		}

		// const result = await ProfileAPI.getProfile();

		// if (!result.success) {
		// 	if (result.status === 404) {
		// 		setShowProfileModal(true);
		// 	}
		// 	return;
		// }
	};

	const loadApp = useCallback(async () => {
		try {
			setHasError(false);
			setLoading(true);

			// Load app-wide configurations and resources here
			await loadAndSetTheme();
			await loadUserData();
			// Add any other app initialization logic here
			// For example: load app settings, initialize services, etc.

			setLoading(false);
		} catch (err) {
			setHasError(true);
			console.error('Error loading app:', err);
		}
	}, []);

	useEffect(() => {
		loadApp();
	}, [loadApp]);

	const value: AppContextProps = {
		isAppLoading: loading,
		hasAppError: hasError,
		retryAppLoading: loadApp,
	};

	if (loading || hasError) {
		return <LoadingView hasError={hasError} retryLoading={loadApp} />;
	}

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

function LoadingView({
	hasError,
	retryLoading,
}: {
	hasError: boolean;
	retryLoading: () => Promise<void>;
}) {
	const { theme } = useThemeMode.getState();
	return (
		<PageScaffold>
			{hasError && <ErrorWidget retryLoading={retryLoading} />}
			<View className="flex justify-center align-items-center h-screen">
				<ActivityIndicator size="small" />
			</View>
		</PageScaffold>
	);
}

function ErrorWidget({ retryLoading }: { retryLoading: () => Promise<void> }) {
	const auth = useAuth();
	const loadingState = useLoadingState();
	const authStore = useAuthStore();
	const userStore = useUserStore();

	const onLogout = async () => {
		const result = await AuthAPI.logout?.({
			refreshToken: authStore?.refreshToken ?? '',
		});

		if (result?.success) {
			authStore.clearAuthData();
			userStore.clearUser();
			auth?.setAuthState?.({
				...auth.authState,
				data: {
					authenticated: false,
					accessToken: undefined,
					refreshToken: undefined,
					userId: undefined,
				},
				user: {
					...({} as User),
				},
			});

			await SecureStore.deleteItemAsync(Strings.TOKEN_KEY);
			await SecureStore.deleteItemAsync(Strings.USERID_KEY);
			await SecureStore.deleteItemAsync(Strings.REFRESH_TOKEN);
			await SecureStore.deleteItemAsync(Strings.LOCAL_STORAGE_USER_KEY);
		} else {
			console.log(result);
			console.log('logout failed');
		}
	};
	return (
		<View className="flex justify-center bg-white align-items-center h-screen">
			<Text>Error loading; app.Please; try again.</Text>

			<Pressable onPress={onLogout}>
				<ThemedText fontSize={12} text={'Logout'} />
			</Pressable>
		</View>
	);
}
