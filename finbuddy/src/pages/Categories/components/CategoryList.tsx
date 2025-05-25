// src/pages/Categories/components/CategoryList.tsx

import React, { useState, useMemo } from 'react';
import { Box, Typography, TextField, List, Skeleton, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { CategoryListItem } from './CategoryListItem';
import { DisplayCategory } from '../'; // Importando o tipo DisplayCategory

interface CategoryListProps {
    categories: DisplayCategory[]; // Recebe as categorias já processadas
    isLoading: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, isLoading }) => {
    const [searchText, setSearchText] = useState('');

    // Filtra apenas por nome, pois os outros filtros já foram aplicados
    const nameFilteredCategories = useMemo(() => {
        if (!searchText) return categories;
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [categories, searchText]);

    if (isLoading && categories.length === 0) {
        return (
            <Box mt={2}>
                {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} variant="rectangular" height={60} sx={{ my: 0.5, borderRadius: 2 }} />
                ))}
            </Box>
        );
    }

    return (
        <Box mt={2}>
            <Typography variant="h6" component="h2" gutterBottom>
                Categorias ({nameFilteredCategories.length} exibidas)
            </Typography>

            <TextField
                label="Pesquisar por nome na lista atual"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
                sx={{ mb: 2 }}
            />

            {nameFilteredCategories.length > 0 ? (
                <List dense>
                    {nameFilteredCategories.map((category) => (
                        <CategoryListItem key={category.id} category={category} />
                    ))}
                </List>
            ) : (
                <Typography sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                    Nenhuma categoria corresponde aos filtros e à busca atual.
                </Typography>
            )}
        </Box>
    );
};
