import { Endpoints } from '@/constants/endpoints';
import type { LoginShema, LogoutSchema, RegisterSchema } from '@/types/api/api.requests.t';
import type { LoginResponse, RegisterResponse } from '@/types/api/api.responses.t';
import type { ApiError } from '@/types/axios.t';
import { ApiWrapper } from './wrapper.api';

const apiWrapper = new ApiWrapper();

export const AuthAPI = {
	login: async (data: LoginShema) => {
		console.log(data)
		const response = await apiWrapper.call<LoginResponse, ApiError>(Endpoints.LoginRoute, {
			data,
			method: 'POST',
		});

		return response;
	},
	register: async (data: RegisterSchema) => {
		const response = await apiWrapper.call<RegisterResponse, ApiError>(Endpoints.RegisterRoute, {
			data,
			method: 'POST',
		});
		return response;
	},
	logout: async (data: LogoutSchema) => {
		return await apiWrapper.call<void, ApiError>(Endpoints.LogoutRoute, {
			data,
			method: 'POST',
		});
	},
};
