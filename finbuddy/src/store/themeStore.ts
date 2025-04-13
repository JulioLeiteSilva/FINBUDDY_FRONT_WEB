import { create } from 'zustand';

type themeState = {
    theme: 'light' | 'dark';
    togleTheme: () => void;
};
export const useThemeStore = create<themeState>((set) => ({
    theme: 'light',
    togleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));