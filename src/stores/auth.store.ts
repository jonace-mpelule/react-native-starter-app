import { create } from 'zustand';
import type { AuthType } from '@/types/auth.t';

interface AuthStore extends AuthType {
	setAuthData: (auth: AuthType) => void;
	clearAuthData: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	...({} as AuthType),
	setAuthData: (data) => set(data),
	clearAuthData: () => set({ ...({} as AuthType) }),
}));
