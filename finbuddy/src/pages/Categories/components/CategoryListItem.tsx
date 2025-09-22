// src/pages/Categories/CategoryListItem.tsx

import React from 'react';
import { ListItem, ListItemText, IconButton, Tooltip, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Lock as LockIcon } from '@mui/icons-material';
import GetMuiIcon from '../../../utils/getMuiIcon'; // Ajuste o caminho
import { CategoryType } from '../../../schemas/Categories'; // Ajuste o caminho

// Tipo combinado para uso interno no componente
interface DisplayCategory extends CategoryType {
    isDefault: boolean;
}

interface CategoryListItemProps {
    category: DisplayCategory;
    // Futuras props para ações
    // onEdit: (id: string) => void;
    // onDelete: (id: string) => void;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({ category }) => {
    const iconColor = category.type === 'INCOME' ? 'success.main' : 'error.main';

    return (
        <ListItem
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                mb: 1,
                bgcolor: 'background.paper',
                p: 1.5,
                opacity: category.isDefault ? 0.85 : 1,
                transition: 'box-shadow 0.2s',
                '&:hover': {
                    boxShadow: category.isDefault ? 'none' : 1,
                }
            }}
            secondaryAction={
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {category.isDefault ? (
                        <Tooltip title="Categoria padrão (não pode ser editada/excluída)">
                            <IconButton size="small" edge="end" disabled>
                                <LockIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <>
                            <Tooltip title="Editar (não implementado)">
                                <IconButton size="small" edge="end" aria-label="edit" disabled>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir (não implementado)">
                                <IconButton size="small" edge="end" aria-label="delete" disabled>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            }
        >
            <GetMuiIcon iconName={category.icon} sx={{ mr: 2, color: iconColor }} />
            <ListItemText
                primary={category.name}
                slotProps={{ primary: { fontWeight: category.isDefault ? 'normal' : 'medium' } }}
                secondary={`${category.type === 'INCOME' ? 'Receita' : 'Despesa'}${category.isDefault ? ' (Padrão)' : ''}`}
            />
        </ListItem>
    );
};