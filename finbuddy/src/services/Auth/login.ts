/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/authService.ts
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { User } from 'firebase/auth';
import { useSnackbarStore } from '../../store/useSnackbarStore';
import { getFirebaseAuthErrorMessage } from '../../utils/firebaseErrorMenssages';

export const Login = async (
    email: string,
    password: string,
    login: (user: User, token: string) => void,
    startLoading: () => void,
    stopLoading: () => void
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    startLoading();
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const token = await res.user.getIdToken();
        login(res.user, token);
    } catch (err) {
        const errorCode = (err as any)?.code || 'auth/unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
    } finally {
        stopLoading();
    }
};
