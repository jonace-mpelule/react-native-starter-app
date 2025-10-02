import { create } from "zustand";

type LoadingStore = {
	loading: boolean;
    setLoading: (data: boolean) => void;
};

export const useLoadingState = create<LoadingStore>((set) => ({
	loading: false,
    setLoading: (data) => set({ loading: data }),
}));