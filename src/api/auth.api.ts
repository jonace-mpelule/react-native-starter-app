import { ApiError } from "@/types/axios.t";
import { ApiWrapper } from "./wrapper.api"

const apiClient = new ApiWrapper();

interface LoginResponse {
    accessToken: string,
    refreshToken: string
}
export const AuthAPI = {
    login: async () => {
        const wrapper = new ApiWrapper();
        const data = {};
        const response = await wrapper.call<LoginResponse, ApiError>("/v1/auth/login", {data, method: "POST"});
        return response;
    }
};
