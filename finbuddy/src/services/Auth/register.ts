/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";
import { RegisterSchemaType } from "../../schemas/auth";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from '../../utils/firebaseErrorMenssages';

export const Register = async (
    data: RegisterSchemaType,
    login: (user: User, token: string) => void,
    startLoading: () => void,
    stopLoading: () => void
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    startLoading();
    try {
        // 1. Cria o usuário no Firebase Auth
        const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = result.user;
        const token = await user.getIdToken();

        // 2. Atualiza a store com auth
        login(user, token);

        // 3. Chama a função `createUser` (Cloud Function)
        const createUserFn = httpsCallable(functions, 'user-preRegisterUser');
        const response = await createUserFn({ name: data.name });

        console.log('Usuário criado na função:', response.data);
        showSnackbar('Cadastro realizado com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao registrar:', error);
    } finally {
        stopLoading();
    }
};
