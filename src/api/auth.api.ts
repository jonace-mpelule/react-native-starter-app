import { ApiError } from "@/types/axios.t";
import { ApiWrapper } from "./wrapper.api"

const apiWrapper = new ApiWrapper();

interface LoginResponse {
    accessToken: string,
    refreshToken: string
}
export const AuthAPI = {
    login: async () => {
        const data = {};
        const response = await apiWrapper.call<LoginResponse, ApiError>("/v1/auth/login", {data, method: "POST"});
        return response;
    }
};
