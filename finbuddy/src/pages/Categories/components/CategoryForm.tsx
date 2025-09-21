// src/pages/Categories/CategoryForm.tsx

import React, { useState } from 'react';
import { Box, TextField, ToggleButtonGroup, ToggleButton, Button, CircularProgress, Alert } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import GetMuiIcon from '../../../utils/getMuiIcon'; // Ajuste o caminho
import { IconPickerModal } from './IconPickerModal';
import { CategoryType } from '../../../schemas/Categories'; // Ajuste o caminho

type NewCategoryData = Omit<CategoryType, 'id'>;

interface CategoryFormProps {
    onAddCategory: (category: NewCategoryData) => Promise<void>;
}

const initialCategoryState: NewCategoryData = {
    name: '',
    icon: 'LabelIcon',
    type: 'EXPENSE'
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ onAddCategory }) => {
    const [newCategory, setNewCategory] = useState<NewCategoryData>(initialCategoryState);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(prev => ({ ...prev, [event.target.name]: event.target.value }));
        if (error) setError(null);
    };

    const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: "INCOME" | "EXPENSE" | null) => {
        if (newType) setNewCategory(prev => ({ ...prev, type: newType }));
    };

    const handleIconSelect = (iconName: string) => {
        setNewCategory(prev => ({ ...prev, icon: iconName }));
        setIsIconModalOpen(false);
        if (error) setError(null);
    };

    const handleAdd = async () => {
        if (!newCategory.name.trim()) {
            setError("O nome da categoria é obrigatório.");
            return;
        }
        setIsAdding(true);
        setError(null);
        try {
            await onAddCategory(newCategory);
            setNewCategory(initialCategoryState);
        } catch (e) {
            setError("Falha ao adicionar categoria. Verifique o console ou tente novamente.");
            console.error(e);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <>
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                <TextField
                    label="Nome da Categoria"
                    variant="outlined"
                    size="small"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    sx={{ flex: '1 1 200px' }}
                    disabled={isAdding}
                />
                <ToggleButtonGroup
                    value={newCategory.type}
                    exclusive
                    onChange={handleTypeChange}
                    size="small"
                    disabled={isAdding}
                >
                    <ToggleButton value="INCOME">Receita</ToggleButton>
                    <ToggleButton value="EXPENSE">Despesa</ToggleButton>
                </ToggleButtonGroup>

                <Button
                    variant="outlined"
                    onClick={() => setIsIconModalOpen(true)}
                    startIcon={<GetMuiIcon iconName={newCategory.icon} />}
                    size="small"
                    sx={{ height: '40px' }}
                    disabled={isAdding}
                >
                    Ícone
                </Button>

                <Button
                    variant="contained"
                    onClick={handleAdd}
                    disabled={isAdding || !newCategory.name.trim()}
                    startIcon={isAdding ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutline />}
                    size="small"
                    sx={{ height: '40px' }}
                >
                    {isAdding ? "Adicionando..." : "Adicionar"}
                </Button>
            </Box>

            <IconPickerModal
                open={isIconModalOpen}
                onClose={() => setIsIconModalOpen(false)}
                onSelectIcon={handleIconSelect}
            />
        </>
    );
};