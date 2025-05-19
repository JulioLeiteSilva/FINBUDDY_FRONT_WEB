import { create } from 'zustand';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';
import { CategorySchemaType } from '../schemas/categories';

interface CategoriesState {
    categories: CategorySchemaType[];
    defaultCategories: CategorySchemaType[];
    message: string;
    isLoading: boolean;
    fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
    categories: [],
    defaultCategories: [],
    message: '',
    isLoading: false,
    
    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const getAllCategoriesFn = httpsCallable(functions, 'category-getAllCategories');
            const responseAllCategories = await getAllCategoriesFn();
            const getAllCategoriesResponse = responseAllCategories.data as unknown as CategorySchemaType[];

            const getAllDefaultCategoriesFn = httpsCallable(functions, 'globalCategory-getAllDefaultCategories');
            const responseDefaultCategories = await getAllDefaultCategoriesFn();
            const getDefaultCategoriesResponse = responseDefaultCategories.data as unknown as CategorySchemaType[];

            set({
                categories: getAllCategoriesResponse,
                defaultCategories: getDefaultCategoriesResponse,
                message: "Sucesso ao pegar todas as categorias",
            });
        } catch (error) {
            console.error('Erro ao pegar todas as categorias:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));