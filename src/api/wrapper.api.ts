import axios, { type Method } from 'axios/';
import type { ApiResponse, RequestOptions } from '@/types/axios.t';
import { axiosConfig } from './axios.config';

export class ApiWrapper {
	private apiClient: Axios.AxiosInstance;

	constructor() {
		this.apiClient = axiosConfig;
	}

	private async request<T, E>(
		config: Axios.AxiosXHRConfig<any>,
		options?: RequestOptions,
	): Promise<ApiResponse<T, E>> {
		try {
			if (config.data instanceof FormData) {
				config.headers = {
					...(config.headers || {}),
					'Content-Type': 'multipart/form-data',
				};
			}

			const response = await this.apiClient.request<T>(config);
			return {
				success: true,
				data: response.data,
				status: response.status,
				headers: response.headers,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					success: false,
					error: {
						data: error.response?.data ?? { message: error.message },
					} as E,
					status: error.response?.status,
					headers: error.response?.headers,
				};
			}

			return {
				success: false,
				error: { message: 'Something went wrong' } as E,
				status: 500,
			};
		}
	}

	async call<T, E>(
		url: string,
		{ data, method, options }: { data?: any; method: Method; options?: RequestOptions },
	): Promise<ApiResponse<T, E>> {
		return this.request<T, E>(
			{
				url,
				data,
				method,
			},
			options,
		);
	}
}
