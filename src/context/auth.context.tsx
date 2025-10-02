/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <''> */
import * as SecureStore from 'expo-secure-store';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AuthAPI } from '@/api/auth.api';
import { axiosConfig } from '@/api/axios.config';
import PageScaffold from '@/components/PageScaffold';
import Strings from '@/constants/strings';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeMode } from '@/stores/thememode.store';
import { useUserStore } from '@/stores/user.store';

import type { LoginShema } from '@/types/api/api.requests.t';
import type { FailedApiResponse, LoginResponse } from '@/types/api/api.responses.t';
import type { AuthType } from '@/types/auth.t';
import type { ApiError, ApiResponse } from '@/types/axios.t';
import type { User } from '@/types/user.t';

interface AuthProps {
	authState: AuthType & { isAuthLoading: boolean };
	setAuthState: (args: { data: AuthType; user: User }) => void;
	onLogin?: (args: LoginShema) => Promise<ApiResponse<LoginResponse, ApiError<FailedApiResponse>>>;
	onRegister?: (...args: any) => Promise<any>;
	onLogout?: () => Promise<void>;
}

const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, setAuthStateInternal] = useState<AuthType & { isAuthLoading: boolean }>({
		userId: undefined,
		email: undefined,
		phoneNumber: undefined,
		role: undefined,
		accessToken: undefined,
		refreshToken: undefined,
		authenticated: false,
		isAuthLoading: true,
	});

	const { setUser, clearUser } = useUserStore();
	const authStore = useAuthStore();

	const [loading, setLoading] = useState(true);

	/** Updates the auth state */
	const setAuthState = (data: AuthType) => {
		setAuthStateInternal({ ...data, isAuthLoading: false });
	};

	/** Loads auth/user data from SecureStore */
	const loadAuthData = async () => {
		try {
			const [userId, accessToken, refreshToken, userData, authData] = await Promise.all([
				SecureStore.getItemAsync(Strings.USERID_KEY),
				SecureStore.getItemAsync(Strings.TOKEN_KEY),
				SecureStore.getItemAsync(Strings.REFRESH_TOKEN),
				SecureStore.getItemAsync(Strings.LOCAL_STORAGE_USER_KEY),
				SecureStore.getItemAsync(Strings.LOCAL_STORAGE_AUTH_KEY),
			]);

			const parsedAuth = authData ? (JSON.parse(authData) as AuthType) : null;
			const parsedUser = userData ? (JSON.parse(userData) as User) : null;

			if (parsedAuth) setAuthState(parsedAuth);
			if (parsedUser) setUser(parsedUser);

			if (accessToken && userId) {
				useAuthStore.setState({ userId, accessToken: accessToken });
				axiosConfig.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
				setAuthState({
					userId,
					email: parsedAuth?.email,
					phoneNumber: parsedAuth?.phoneNumber,
					role: parsedAuth?.role,
					accessToken,
					refreshToken: refreshToken ?? undefined,
					authenticated: true,
				});
			}
		} catch (err) {
			console.error('Error loading auth data:', err);
			setAuthState({
				userId: undefined,
				email: undefined,
				phoneNumber: undefined,
				role: undefined,
				accessToken: undefined,
				refreshToken: undefined,
				authenticated: false,
			});
		}
	};

	useEffect(() => {
		(async () => {
			setLoading(true);
			await loadAuthData();
			setLoading(false);
		})();
	}, []);

	/** Saves tokens + user on login */
	const saveDataOnLogin = async (auth: AuthType, user: User) => {
		await Promise.all([
			SecureStore.setItemAsync(Strings.TOKEN_KEY, auth.accessToken ?? ''),
			SecureStore.setItemAsync(Strings.USERID_KEY, auth.userId ?? ''),
			SecureStore.setItemAsync(Strings.REFRESH_TOKEN, auth.refreshToken ?? ''),
			SecureStore.setItemAsync(Strings.LOCAL_STORAGE_USER_KEY, JSON.stringify(user)),
			SecureStore.setItemAsync(Strings.LOCAL_STORAGE_AUTH_KEY, JSON.stringify(auth)),
		]);

		setUser(user);
		setAuthState(auth);
	};

	/** Clears state & storage on logout */
	const logout = async () => {
		try {
			if (authState.refreshToken) {
				await AuthAPI.logout({ refreshToken: authState.refreshToken });
			}

			await Promise.all([
				SecureStore.deleteItemAsync(Strings.TOKEN_KEY),
				SecureStore.deleteItemAsync(Strings.USERID_KEY),
				SecureStore.deleteItemAsync(Strings.REFRESH_TOKEN),
				SecureStore.deleteItemAsync(Strings.LOCAL_STORAGE_USER_KEY),
				SecureStore.deleteItemAsync(Strings.LOCAL_STORAGE_AUTH_KEY),
			]);

			authStore.clearAuthData();
			clearUser();

			setAuthState({
				userId: undefined,
				accessToken: undefined,
				refreshToken: undefined,
				authenticated: false,
				email: undefined,
				phoneNumber: undefined,
				role: undefined,
			});
		} catch (err) {
			console.error('Logout failed:', err);
		}
	};

	const value: AuthProps = {
		authState: { ...authState, isAuthLoading: loading },
		setAuthState: ({ data, user }) => saveDataOnLogin(data, user),
		onLogin: AuthAPI.login,
		onRegister: AuthAPI.register,
		onLogout: logout,
	};

	if (loading) return <LoadingView />;

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function LoadingView() {
	useThemeMode.getState(); // keeping theme hook, but unused in rendering
	return (
		<PageScaffold>
			<View className="flex justify-center items-center h-screen">
				<ActivityIndicator size="small" />
			</View>
		</PageScaffold>
	);
}
