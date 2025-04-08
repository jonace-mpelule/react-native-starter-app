import axios from "axios"
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, TOKEN_KEY, USERID_KEY } from "@/constants/values";
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

export const baseURL = 'http://127.0.0.1:2102'
export const axiosConfig = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    }
})

// d@ts-ignore
axiosConfig.interceptors.request.use(async function (config) : Promise<any> {
    var accessToken = SecureStore.getItem(TOKEN_KEY, {
        requireAuthentication: false
    });

    var refreshToken = SecureStore.getItem(REFRESH_TOKEN, {
        requireAuthentication: false
    });

    if (!config.headers!['Authorization']) {
        config.headers!["Authorization"] = `Bearer ${accessToken}`;
    }
    
    if (!accessToken || !refreshToken) return config;

    const user = jwtDecode(accessToken);
    
    const isExpired = dayjs.unix(user.exp!).diff(dayjs()) < 1;
    console.log(isExpired);
    if (!isExpired) return config;

    const refresh = jwtDecode(refreshToken);
    const isExp = dayjs.unix(refresh.exp!).diff(dayjs()) < 1;
    console.log(`refresh token expired?: ${isExp}`);

    var newConf = await axios.post(`${baseURL}/v1/auth/refresh-token`, {}, {
        headers: {
            'Content-Type': 'application/json', 
            'x-refresh-token': refreshToken
        }
    }).then(async(response: any) => {
       

        const accessToken = response.data['data']['accessToken'];
        const refreshToken = response.data['data']['refreshToken'];

        axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        config.headers!['Authorization'] = `Bearer ${accessToken}`;
        
        SecureStore.setItem(TOKEN_KEY, accessToken, {
            requireAuthentication: false,
        });
        SecureStore.setItem(REFRESH_TOKEN, refreshToken, {
            requireAuthentication: false,
        });

        return config;
    }).catch(async (error) => {
        useAuthStore.setState({
            ...{}
        });
        useUserStore.setState({
            ...{}
        });

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USERID_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
        console.log(error.request['_headers']);
        console.log(error.response['data']);
    })

    return newConf;
    
}, async (error) => {
    console.log(error)
})
