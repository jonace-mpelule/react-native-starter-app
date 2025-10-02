/** biome-ignore-all lint/correctness/noUnusedPrivateClassMembers: <'cuz i said so'> */
import type { Account, Tokens } from '../account.t';
import type { Country } from '../countries.t';
import type { User } from '../user.t';

export type LoginResponse = {
	account: Account;
	user: User;
	tokens: Tokens;
};

export type RegisterResponse = {
	account: Account;
	user: User;
	tokens: Tokens;
};

export type LogoutResponse = {};

export type RefreshTokenResponse = {
	tokens: { accessToken: string; refreshToken: string };
};

export type CountriesResponse = {
	countries: Country[];
};

export type FailedApiResponse = {
	code: string;
};

export type GetProfileResponse = {
	profile: User;
};

export class ApiResponseConvert {
	#_: any;
	public static toRegisterResponse(json: string): RegisterResponse {
		return JSON.parse(json);
	}

	public static registerResponseToJson(value: RegisterResponse): string {
		return JSON.stringify(value);
	}
}
