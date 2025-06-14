// src/store/authStore.ts
import { create } from 'zustand';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

type AuthState = {
    user: User | null;  // Dados do usuário (pode ser o objeto completo do Firebase)
    token: string | null;  // O token de autenticação
    login: (user: User, token: string) => void;  // Função de login
    logout: () => Promise<void>;  // Função de logout
    setUser: (user: User | null) => void;  // Função para definir o usuário
    setToken: (token: string) => void;  // Função para definir o token
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    login: (user, token) => set({ user, token }),  // Define o usuário e token no estado
    logout: async () => {
        try {
            await signOut(auth);  // Desloga do Firebase Auth
            set({ user: null, token: null });  // Limpa o estado de autenticação
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    },
    setUser: (user) => set({ user }),  // Atualiza o estado do usuário
    setToken: (token) => set({ token }),  // Atualiza o token no estado
}));

// Função para escutar as mudanças de autenticação
export const listenAuthState = () => {
    const { setUser, setToken } = useAuthStore.getState();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Se o usuário estiver autenticado
            user.getIdToken().then((token) => {
                setUser(user);
                setToken(token);  // Define o token no estado
            });
        } else {
            // Se o usuário não estiver autenticado
            setUser(null);
            setToken('');
        }
    });
};
