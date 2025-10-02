import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import Strings from '@/constants/strings';

const THEME_MODE = {
	light: 'light',
	dark: 'dark',
} as const;
type Modes = keyof typeof THEME_MODE;

type ThemeStore = {
	theme: Modes;
	setTheme: (data: Modes) => void;
};

export const useThemeMode = create<ThemeStore>((set) => ({
	theme: 'light',
	setTheme: async (data) => {
		await SecureStore.setItemAsync(Strings.THEME_STORE_KEY, data);
		set({ theme: data });
	},
}));
