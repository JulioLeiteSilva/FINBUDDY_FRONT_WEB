// src/store/authStore.ts
import { create } from 'zustand';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type AuthState = {
    user: any;  // Dados do usuário (pode ser o objeto completo do Firebase)
    token: string | null;  // O token de autenticação
    login: (user: any, token: string) => void;  // Função de login
    logout: () => void;  // Função de logout
    setUser: (user: any) => void;  // Função para definir o usuário
    setToken: (token: string) => void;  // Função para definir o token
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    login: (user, token) => set({ user, token }),  // Define o usuário e token no estado
    logout: () => set({ user: null, token: null }),  // Limpa o estado de autenticação
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
