import { create } from 'zustand'
import { type User } from '@/types/user.t'

interface UserStore extends User {
    hasLoaded: boolean,
    setUser: (user: User) => void,
    clearUser: () => void,
}

export const useUserStore = create<UserStore>((set) => ({
    ...({} as User),
    hasLoaded: false,
    setUser: (user: User) => set({ ...user, hasLoaded: true }),
    clearUser: () => set({ ...({} as User)}),
}))