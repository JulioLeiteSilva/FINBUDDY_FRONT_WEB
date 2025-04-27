import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { auth, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

export const Register = async (
    email: string,
    name: string,
    password: string,
    login: (user: User, token: string) => void,
    startLoading: () => void,
    stopLoading: () => void
) => {

    startLoading();
    try {
        // 1. Cria o usuário no Firebase Auth
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const token = await user.getIdToken();

        // 2. Atualiza a store com auth
        login(user, token);

        // 3. Chama a função `createUser` (Cloud Function)
        const createUserFn = httpsCallable(functions, 'user-preRegisterUser');

        const response = await createUserFn({
            name: name, // Use o nome do formulário validado
        });

        console.log('Usuário criado na função:', response.data);
    } catch (error) {
        console.error('Erro ao registrar:', error);
        // Aqui você pode adicionar lógica para exibir mensagens de erro ao usuário
    } finally {
        stopLoading(); // Finaliza o loading, independentemente do resultado
    }
}