// src/pages/Categories/components/CategoryOriginFilter.tsx
import React from 'react';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export type CategoryOrigin = 'all' | 'custom' | 'default';

interface CategoryOriginFilterProps {
    selectedOrigin: CategoryOrigin;
    onChange: (newOrigin: CategoryOrigin) => void;
}

export const CategoryOriginFilter: React.FC<CategoryOriginFilterProps> = ({ selectedOrigin, onChange }) => {
    const handleOriginChange = (
        _event: React.MouseEvent<HTMLElement>,
        newOrigin: CategoryOrigin | null,
    ) => {
        if (newOrigin !== null) {
            onChange(newOrigin);
        }
    };

    return (
        // O Grid item na CategoriesPage agora controla o layout principal deste componente.
        // O mb pode ser adicionado diretamente no Grid item se necessário.
        <>
            <Typography variant="caption" gutterBottom sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Filtrar por Origem:
            </Typography>
            <ToggleButtonGroup
                color="primary"
                value={selectedOrigin}
                exclusive
                onChange={handleOriginChange}
                aria-label="Filtrar origem da categoria"
                size="small"
                // fullWidth pode ser problemático se o Grid item já define a largura.
                // Se precisar que o ToggleButtonGroup ocupe a largura do Grid item,
                // o Grid item deve ter uma largura definida (ex: xs={12}) e o ToggleButtonGroup pode usar sx={{ width: '100%' }}
                sx={{ width: '100%' }} // Garante que o grupo ocupe a largura do Grid item
            >
                <ToggleButton value="all" aria-label="todas origens" sx={{ flexGrow: 1 }}>Todas</ToggleButton>
                <ToggleButton value="custom" aria-label="personalizadas" sx={{ flexGrow: 1 }}>Personalizadas</ToggleButton>
                <ToggleButton value="default" aria-label="padrão" sx={{ flexGrow: 1 }}>Padrão</ToggleButton>
            </ToggleButtonGroup>
        </>
    );
};
