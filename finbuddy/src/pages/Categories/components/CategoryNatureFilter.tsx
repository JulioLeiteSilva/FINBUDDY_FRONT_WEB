// src/pages/Categories/components/CategoryNatureFilter.tsx
import React from 'react';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export type CategoryNature = 'all' | 'INCOME' | 'EXPENSE';

interface CategoryNatureFilterProps {
    selectedNature: CategoryNature;
    onChange: (newNature: CategoryNature) => void;
}

export const CategoryNatureFilter: React.FC<CategoryNatureFilterProps> = ({ selectedNature, onChange }) => {
    const handleNatureChange = (
        _event: React.MouseEvent<HTMLElement>,
        newNature: CategoryNature | null,
    ) => {
        if (newNature !== null) {
            onChange(newNature);
        }
    };

    return (
        <>
            <Typography variant="caption" gutterBottom sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Filtrar por Natureza:
            </Typography>
            <ToggleButtonGroup
                color="primary"
                value={selectedNature}
                exclusive
                onChange={handleNatureChange}
                aria-label="Filtrar natureza da categoria"
                size="small"
                sx={{ width: '100%' }} // Garante que o grupo ocupe a largura do Grid item
            >
                <ToggleButton value="all" aria-label="todas naturezas" sx={{ flexGrow: 1 }}>Todas</ToggleButton>
                <ToggleButton value="INCOME" aria-label="receitas" sx={{ flexGrow: 1 }}>Receitas</ToggleButton>
                <ToggleButton value="EXPENSE" aria-label="despesas" sx={{ flexGrow: 1 }}>Despesas</ToggleButton>
            </ToggleButtonGroup>
        </>
    );
};
