import { create } from 'zustand';

type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarState {
    open: boolean;
    message: string;
    type: SnackbarType;
    showSnackbar: (message: string, type?: SnackbarType) => void;
    closeSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
    open: false,
    message: '',
    type: 'info',
    showSnackbar: (message, type = 'info') => set({ open: true, message, type }),
    closeSnackbar: () => set({ open: false }),
}));
