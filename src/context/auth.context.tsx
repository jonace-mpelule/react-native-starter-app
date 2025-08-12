import { useUserStore } from "@/stores/user.store"
import { useRouter, useSegments } from "expo-router"
import { createContext, useContext, useEffect, useState } from "react"
import { useThemeMode } from "@/stores/thememode.store"
import * as SecureStore from "expo-secure-store"
import Strings from "@/constants/strings"
// ------ COMPONENTS -------
import PageScaffold from "@/components/PageScaffold"
import {View, ActivityIndicator} from "react-native"
import { axiosConfig } from "@/api/axios.config"
import { useAuthStore } from "@/stores/auth.store"
import { User } from "@/types/user.t"


interface userData {
    userId: string | null, 
    token: string | null, 
    refreshToken: string | null,
    authenticated: boolean | null
}   

interface AuthProps {
    authState?: userData, 
    setAuthState?: (data: userData) => void,
    onLogin?: (...args: any) => Promise<any>, 
    onRegister?: (...args: any) => Promise<any>,
    onLogout?: () => any
}

const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
    const router = useRouter()
    const segment = useSegments()
    const [loading, setLoading] = useState<boolean>(false)
    const [hasError, setHasError] = useState<boolean>(false)

    const [authState, setAuthState] = useState<userData>({
        ...{} as userData,
    })

    const {setUser} = useUserStore()

    const loadAndSetTheme = async () => {
        const storedTheme = await SecureStore.getItemAsync(Strings.THEME_STORE_KEY) as any;
        if (storedTheme) {
            useThemeMode.setState({ theme: storedTheme });
        }
    };

    const loadAuthData = async () => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(1000)
        const token = await SecureStore.getItemAsync(Strings.TOKEN_KEY);
        const userId = await SecureStore.getItemAsync(Strings.USERID_KEY);
        const refreshToken = await SecureStore.getItemAsync(Strings.REFRESH_TOKEN);
        const userData = await SecureStore.getItemAsync(Strings.LOCAL_STORAGE_USER_KEY)

        if (token && userId) {
            useAuthStore.setState({
                userId: userId,
                accessToken: token,
            })
            console.log("Auth data loaded", { token, userId });
            axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setAuthState({
                userId: userId,
                token: token,
                refreshToken: refreshToken,
                authenticated: true
            })
        }

        if(userData){
            const data = JSON.parse(userData) as User
            setUser({
                ...data, 

            })
        }
    }

    const loadApp = async () => {
        try {
            setHasError(false)
            setLoading(true)
            await loadAuthData();
            setLoading(false)

        } catch (err) {
            setHasError(true)
            console.log(JSON.stringify(err))
        }
    }

    useEffect(() => {
        loadAndSetTheme()
        loadApp()
    }, [])


    const value: AuthProps = {
        authState,
        setAuthState,
        onLogin: async () => {
            return Promise.resolve()
        },
        onRegister: async () => {
            return Promise.resolve()
        },
        onLogout: async () => {
            return Promise.resolve()
        }
    }

    if(loading) {
        return <LoadingView hasError={false} setHasError={() => {}} loadApp={() => {}} />
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 

function LoadingView ({hasError, setHasError, loadApp}: any) {
    const { theme } = useThemeMode.getState()
    return (
        <PageScaffold>
            <View className="flex justify-center align-items-center h-screen" style={{}}>
                <ActivityIndicator size="small" />
            </View>
        </PageScaffold>
    );
}
