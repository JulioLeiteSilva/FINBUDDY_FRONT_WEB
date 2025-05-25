import { useMemo, useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Divider, Grid } from "@mui/material";
import { useCategoriesStore } from "../../store/categoriesStore";
import { CreateCategory } from "../../services/Categories";
import { CategoryForm } from './components/CategoryForm';
import { CategoryList } from './components/CategoryList';
import { CategorySchemaType } from '../../schemas/Categories';
import { CategoryOriginFilter, CategoryOrigin } from './components/CategoryOriginFilter';
import { CategoryNatureFilter, CategoryNature } from './components/CategoryNatureFilter';

export interface DisplayCategory extends CategorySchemaType {
    isDefault: boolean;
}

export const CategoriesPage = () => {
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

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Card sx={{ maxWidth: 900, m: 'auto' }}>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                        Gerenciar Categorias
                    </Typography>

                    <CategoryForm onAddCategory={handleAddCategory} />

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={2} sx={{ mb: 2 }} alignItems="stretch">
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <CategoryOriginFilter
                                selectedOrigin={originFilter}
                                onChange={setOriginFilter}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 6 }} >
                            <CategoryNatureFilter
                                selectedNature={natureFilter}
                                onChange={setNatureFilter}
                            />
                        </Grid>
                    </Grid>

                    <CategoryList categories={processedCategories} isLoading={isLoading} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default CategoriesPage;
