import { create } from 'zustand';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';
import { GetAllDefaultCategoriesResponseType, GetAllCategoriesResponseType, CategoryType } from '../schemas/Categories';

interface CategoriesState {
    categories: CategoryType[];
    defaultCategories: CategoryType[];
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
            const getAllCategoriesResponse = responseAllCategories.data as unknown as GetAllCategoriesResponseType;

            const getAllDefaultCategoriesFn = httpsCallable(functions, 'globalCategory-getAllDefaultCategories');
            const responseDefaultCategories = await getAllDefaultCategoriesFn();
            const getDefaultCategoriesResponse = responseDefaultCategories.data as unknown as GetAllDefaultCategoriesResponseType;

            set({
                categories: getAllCategoriesResponse.data as unknown as CategoryType[],
                defaultCategories: getDefaultCategoriesResponse.data.categories as unknown as CategoryType[],
                message: "Sucesso ao pegar todas as categorias",
            });
        } catch (error) {
            console.error('Erro ao pegar todas as categorias:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));