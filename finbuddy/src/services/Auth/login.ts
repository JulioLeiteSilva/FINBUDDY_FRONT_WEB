import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { User } from 'firebase/auth';

export const Login = async (
    email: string,
    password: string,
    login: (user: User, token: string) => void,
    startLoading: () => void,
    stopLoading: () => void
) => {
    startLoading();
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const token = await res.user.getIdToken();
        login(res.user, token);
    } catch (err) {
        console.error('Erro ao logar:', err);
    } finally {
        stopLoading();
    }
};