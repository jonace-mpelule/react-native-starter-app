import {create} from "zustand"
import { Auth } from "@/types/auth.t";

interface AuthStore extends Auth {
    setAuthData: (auth: Auth) => void
    clearAuthData: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    ...{} as Auth, 
    setAuthData: (data) => set(data),
    clearAuthData: () => set({...{} as Auth})
}))