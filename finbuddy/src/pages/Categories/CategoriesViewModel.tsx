import { useMemo, useEffect, useState } from "react";
import { useCategoriesStore } from "../../store/categoriesStore";
import { CreateCategory } from "../../services/Categories";
import { CategorySchemaType } from '../../schemas/Categories';
import { CategoryOrigin } from './components/CategoryOriginFilter';
import { CategoryNature } from './components/CategoryNatureFilter';

export interface DisplayCategory extends CategorySchemaType {
    isDefault: boolean;
}

export const useCategoriesViewModel = () => {
    const {
        categories: userCategories,
        defaultCategories,
        isLoading,
        fetchCategories,
    } = useCategoriesStore();

    const [originFilter, setOriginFilter] = useState<CategoryOrigin>('all');
    const [natureFilter, setNatureFilter] = useState<CategoryNature>('all');

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async (categoryData: Omit<CategorySchemaType, 'id'>) => {
        try {
            await CreateCategory(categoryData);
        } catch (error) {
            console.error("Erro capturado na página ao criar categoria:", error);
            throw error;
        }
    };

    const processedCategories = useMemo(() => {
        let combined: DisplayCategory[] = [
            ...defaultCategories.map(cat => ({ ...cat, isDefault: true })),
            ...userCategories.map(cat => ({ ...cat, isDefault: false })),
        ];

        if (natureFilter !== 'all') {
            combined = combined.filter(cat => cat.type === natureFilter);
        }

        if (originFilter === 'custom') {
            combined = combined.filter(cat => !cat.isDefault);
        } else if (originFilter === 'default') {
            combined = combined.filter(cat => cat.isDefault);
        }

        const customSorted = combined
            .filter(cat => !cat.isDefault)
            .sort((a, b) => a.name.localeCompare(b.name));

        const defaultSorted = combined
            .filter(cat => cat.isDefault)
            .sort((a, b) => a.name.localeCompare(b.name));

        return [...customSorted, ...defaultSorted];
    }, [userCategories, defaultCategories, originFilter, natureFilter]);

   return {
    isLoading,
    handleAddCategory,
    processedCategories,
    originFilter,
    setOriginFilter,
    natureFilter,
    setNatureFilter,
   } 
}