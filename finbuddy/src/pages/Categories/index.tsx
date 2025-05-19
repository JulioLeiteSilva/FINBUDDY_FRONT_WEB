/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import {
    Box, Button, Card, CardContent, TextField, Typography, List, ListItem, ListItemText,
    Skeleton, Divider, IconButton, Dialog, DialogTitle, DialogContent, Grid, InputAdornment,
    ToggleButtonGroup, ToggleButton, CircularProgress, Tooltip, Alert
} from "@mui/material";
import {
    AddCircleOutline, Close as CloseIcon, Search as SearchIcon,
    Edit as EditIcon, Delete as DeleteIcon, Lock as LockIcon,
} from "@mui/icons-material"; // Ícones ainda necessários para ações diretas

// Importe o seu schema, store e service
import { CategorySchemaType } from "../../schemas/categories"; // Ajuste o caminho
import { useCategoriesStore } from "../../store/categoriesStore"; // Ajuste o caminho
import { CreateCategory } from "../../services/Categories"; // Ajuste o caminho

// Importe o utilitário GetMuiIcon e a lista de ícones para o picker
import GetMuiIcon from '../../utils/getMuiIcon'; // Ajuste o caminho
import { muiIconsForPickerList } from '../../config/muiIconList'; // Ajuste o caminho

interface IconPickerModalProps {
    open: boolean;
    onClose: () => void;
    onSelectIcon: (iconName: string) => void;
}

// IconPickerModal agora usa muiIconsForPickerList importado
const IconPickerModal: React.FC<IconPickerModalProps> = ({ open, onClose, onSelectIcon }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtra a lista importada
    const filteredIcons = useMemo(() => {
        return muiIconsForPickerList.filter(icon =>
            icon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleIconClick = (iconName: string) => {
        onSelectIcon(iconName);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Selecionar Ícone
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Pesquisar Ícone"
                    variant="outlined"
                    size="small"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Grid container spacing={2} sx={{ mt: 1, maxHeight: '60vh', overflowY: 'auto' }}>
                    {filteredIcons.map(({ name, component: IconComp }) => (
                        <Grid>
                            <Tooltip title={name.replace('Icon', '')} placement="top">
                                <IconButton onClick={() => handleIconClick(name)} size="large" sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    '&:hover': { backgroundColor: 'action.hover' }
                                }}>
                                    {/* O IconPickerModal continua renderizando o componente diretamente */}
                                    {/* pois muiIconsForPickerList já contém o componente. */}
                                    <IconComp sx={{ fontSize: 32, mb: 0.5 }} />
                                    <Typography variant="caption" sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100%'
                                    }}>
                                        {name.replace('Icon', '')}
                                    </Typography>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    ))}
                    {filteredIcons.length === 0 && (
                        <Grid>
                            <Typography sx={{ textAlign: 'center', my: 3 }}>
                                Nenhum ícone encontrado.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
// --- End Icon Picker Modal ---

interface DisplayCategory extends CategorySchemaType {
    isDefault: boolean;
}

const CategoriesPage = () => {
    const {
        categories: userCategories,
        defaultCategories,
        isLoading,
        fetchCategories,
    } = useCategoriesStore();

    const initialCategoryState: Omit<CategorySchemaType, 'id'> = {
        name: '',
        icon: 'LabelIcon', // Nome do ícone padrão para o formulário (deve existir em muiIconList.ts)
        type: 'EXPENSE' as "INCOME" | "EXPENSE"
    };
    const [newCategoryData, setNewCategoryData] = useState(initialCategoryState);
    const [searchText, setSearchText] = useState<string>('');
    const [isIconModalOpen, setIsIconModalOpen] = useState<boolean>(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewCategoryData(prev => ({ ...prev, [name]: value }));
        if (clientError) setClientError(null);
    };

    const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newType: "INCOME" | "EXPENSE" | null) => {
        if (newType !== null) {
            setNewCategoryData(prev => ({ ...prev, type: newType }));
        }
    };

    const handleIconSelect = (iconName: string) => {
        setNewCategoryData(prev => ({ ...prev, icon: iconName }));
        if (clientError && newCategoryData.icon) setClientError(null);
    };

    const handleAddCategory = async () => {
        setClientError(null);
        if (!newCategoryData.name.trim()) {
            setClientError("O nome da categoria não pode ser vazio.");
            return;
        }
        if (!newCategoryData.icon || newCategoryData.icon === 'LabelIcon' && !muiIconsForPickerList.some(icon => icon.name === 'LabelIcon')) {
            setClientError("Por favor, selecione um ícone para a categoria.");
            return;
        }

        setIsAddingCategory(true);
        try {
            await CreateCategory(newCategoryData);
            setNewCategoryData(initialCategoryState);
        } catch (error) {
            console.error("Erro ao criar categoria (capturado na página):", error);
        } finally {
            setIsAddingCategory(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const displayCategories: DisplayCategory[] = useMemo(() => {
        const defaults = defaultCategories.map(cat => ({ ...cat, isDefault: true }));
        const users = userCategories.map(cat => ({ ...cat, isDefault: false }));
        return [...defaults, ...users].sort((a, b) => a.name.localeCompare(b.name));
    }, [defaultCategories, userCategories]);

    const filteredCategories = useMemo(() => {
        return displayCategories.filter(category =>
            category.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [displayCategories, searchText]);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Card sx={{ maxWidth: 900, m: 'auto' }}>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                        Gerenciar Categorias
                    </Typography>

                    {clientError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setClientError(null)}>{clientError}</Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, alignItems: 'flex-start' }}>
                        <TextField
                            label="Nome da Categoria"
                            variant="outlined"
                            size="small"
                            name="name"
                            value={newCategoryData.name}
                            onChange={handleInputChange}
                            sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '200px' } }}
                            error={!!clientError && !newCategoryData.name.trim()}
                            disabled={isAddingCategory}
                        />
                        <ToggleButtonGroup
                            value={newCategoryData.type}
                            exclusive
                            onChange={handleTypeChange}
                            aria-label="Tipo da Categoria"
                            size="small"
                            sx={{ height: '40px' }}
                            disabled={isAddingCategory}
                        >
                            <ToggleButton value="INCOME" aria-label="Receita">Receita</ToggleButton>
                            <ToggleButton value="EXPENSE" aria-label="Despesa">Despesa</ToggleButton>
                        </ToggleButtonGroup>
                        <Button
                            variant="outlined"
                            onClick={() => setIsIconModalOpen(true)}
                            startIcon={<GetMuiIcon iconName={newCategoryData.icon} />}
                            size="small"
                            sx={{ height: '40px', minWidth: { xs: '100%', sm: '150px' } }}
                            color={clientError && !newCategoryData.icon ? "error" : "primary"}
                            disabled={isAddingCategory}
                        >
                            Ícone
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAddCategory}
                            disabled={isLoading || isAddingCategory || !newCategoryData.name.trim()}
                            startIcon={isAddingCategory ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutline />}
                            size="small"
                            sx={{ height: '40px', minWidth: { xs: '100%', sm: '130px' } }}
                        >
                            {isAddingCategory ? "Adicionando..." : "Adicionar"}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 2, mb: 1 }}>
                        Categorias Existentes ({filteredCategories.length})
                    </Typography>

                    <TextField
                        label="Pesquisar Categoria"
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="dense"
                        value={searchText}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    {isLoading && displayCategories.length === 0 ? (
                        <>
                            {[...Array(4)].map((_, idx) => (
                                <Skeleton key={idx} variant="rectangular" height={50} sx={{ my: 1, borderRadius: 1 }} />
                            ))}
                        </>
                    ) : filteredCategories.length === 0 && !isLoading ? (
                        <Typography sx={{ textAlign: 'center', my: 3, color: 'text.secondary' }}>
                            Nenhuma categoria encontrada.
                        </Typography>
                    ) : (
                        <List dense>
                            {filteredCategories.map((category) => (
                                <ListItem
                                    key={category.id}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        mb: 1,
                                        bgcolor: 'background.paper',
                                        p: 1.5,
                                        opacity: category.isDefault ? 0.8 : 1,
                                        '&:hover': {
                                            boxShadow: category.isDefault ? 0 : 1,
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
                                    <GetMuiIcon iconName={category.icon} sx={{ mr: 2, color: category.type === 'INCOME' ? 'success.main' : 'error.main' }} />
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{ fontWeight: category.isDefault ? 'normal' : 'medium' }}
                                        secondary={`${category.type === 'INCOME' ? 'Receita' : 'Despesa'}${category.isDefault ? ' (Padrão)' : ''}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {isLoading && displayCategories.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            <Typography>Carregando categorias...</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <IconPickerModal
                open={isIconModalOpen}
                onClose={() => setIsIconModalOpen(false)}
                onSelectIcon={handleIconSelect}
            />
        </Box>
    );
};

export default CategoriesPage;
