import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { Endpoints } from '@/constants/endpoints';
import Strings from '@/constants/strings';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import type { RefreshTokenResponse } from '@/types/api/api.responses.t';

export const baseURL = 'http://127.0.0.1:2102';
export const axiosConfig = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// d@ts-expect-error
axiosConfig.interceptors.request.use(
	async (config): Promise<any> => {
		var accessToken = await SecureStore.getItemAsync(Strings.TOKEN_KEY);
		var refreshToken = await SecureStore.getItemAsync(Strings.REFRESH_TOKEN);

		if (!(config.headers as any).Authorization) {
			(config.headers as any).Authorization = `Bearer ${accessToken}`;
		}

		if (!accessToken || !refreshToken) return config;

		const user = jwtDecode(accessToken);

		const isExpired = dayjs.unix(Number(user.exp)).diff(dayjs()) < 1;
		console.log(isExpired);
		if (!isExpired) return config;

		const refresh = jwtDecode(refreshToken);
		const isExp = dayjs.unix(Number(refresh.exp)).diff(dayjs()) < 1;
		console.log(`refresh token expired?: ${isExp}`);

		var newConf = await axios
			.post(
				`${baseURL}${Endpoints.RefreshTokenRoute}`,
				{
					refreshToken,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						// 'x-refresh-token': refreshToken
					},
				},
			)
			.then(async (response: any) => {
				const data = response.data as RefreshTokenResponse;

				console.log('------ refresh token response');
				console.log(data);
				console.log('------');

				const accessToken = data.tokens.accessToken;
				const refreshToken = data.tokens.refreshToken;

				axiosConfig.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
				(config.headers as any).Authorization = `Bearer ${accessToken}`;

				await SecureStore.setItemAsync(Strings.TOKEN_KEY, accessToken);
				await SecureStore.setItemAsync(Strings.REFRESH_TOKEN, refreshToken);

				return config;
			})
			.catch(async (error) => {
				const router = useRouter();
				console.log('------------');
				console.log(JSON.stringify(error.data));
				console.log('------------');
				useAuthStore.setState({
					...{},
				});
				useUserStore.setState({
					...{},
				});
				await SecureStore.deleteItemAsync(Strings.TOKEN_KEY);
				await SecureStore.deleteItemAsync(Strings.USERID_KEY);
				await SecureStore.deleteItemAsync(Strings.REFRESH_TOKEN);
				router.dismissAll();
			});

		return newConf;
	},
	async (error) => {
		console.log(error);
	},
);
