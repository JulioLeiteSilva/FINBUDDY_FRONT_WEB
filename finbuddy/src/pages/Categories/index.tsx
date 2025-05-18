import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
    Box, Button, Card, CardContent, TextField, Typography, List, ListItem, ListItemText,
    Skeleton, Divider, IconButton, Dialog, DialogTitle, DialogContent, Grid, InputAdornment,
    ToggleButtonGroup, ToggleButton, CircularProgress, Tooltip
} from "@mui/material";
import {
    AddCircleOutline, Close as CloseIcon, Search as SearchIcon, HelpOutline as HelpOutlineIcon,
    Home as HomeIcon, AccountBalance as AccountBalanceIcon, ShoppingCart as ShoppingCartIcon,
    Fastfood as FastfoodIcon, Train as TrainIcon, LocalHospital as LocalHospitalIcon,
    School as SchoolIcon, FitnessCenter as FitnessCenterIcon, AttachMoney as AttachMoneyIcon,
    TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Edit as EditIcon,
    Delete as DeleteIcon, Settings as SettingsIcon, Info as InfoIcon, Warning as WarningIcon,
    CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Category as CategoryIcon, Label as LabelIcon,
    Palette as PaletteIcon, Build as BuildIcon, Lightbulb as LightbulbIcon, Flight as FlightIcon,
    Hotel as HotelIcon, LocalGasStation as LocalGasStationIcon, Phone as PhoneIcon, Email as EmailIcon,
    Person as PersonIcon, Group as GroupIcon, Work as WorkIcon, Business as BusinessIcon,
    Savings as SavingsIcon, Receipt as ReceiptIcon, CreditCard as CreditCardIcon,
    MonetizationOn as MonetizationOnIcon, EuroSymbol as EuroSymbolIcon, Paid as PaidIcon,
    Pets as PetsIcon, Book as BookIcon, MusicNote as MusicNoteIcon, SportsEsports as SportsEsportsIcon,
    Movie as MovieIcon, LocalBar as LocalBarIcon, DirectionsCar as DirectionsCarIcon,
    Apartment as ApartmentIcon, ChildFriendly as ChildFriendlyIcon, Healing as HealingIcon
} from "@mui/icons-material";

export interface Category {
    id: string;
    name: string;
    icon: string;
    type: "INCOME" | "EXPENSE";
}

const iconComponents: { [key: string]: React.ElementType } = {
    HomeIcon, AccountBalanceIcon, ShoppingCartIcon, FastfoodIcon, TrainIcon, LocalHospitalIcon,
    SchoolIcon, FitnessCenterIcon, AttachMoneyIcon, TrendingUpIcon, TrendingDownIcon, EditIcon,
    DeleteIcon, SettingsIcon, InfoIcon, WarningIcon, CheckCircleIcon, CancelIcon, CategoryIcon, LabelIcon,
    PaletteIcon, BuildIcon, LightbulbIcon, FlightIcon, HotelIcon, LocalGasStationIcon, PhoneIcon, EmailIcon,
    PersonIcon, GroupIcon, WorkIcon, BusinessIcon, SavingsIcon, ReceiptIcon, CreditCardIcon,
    MonetizationOnIcon, EuroSymbolIcon, PaidIcon, PetsIcon, BookIcon, MusicNoteIcon, SportsEsportsIcon,
    MovieIcon, LocalBarIcon, DirectionsCarIcon, ApartmentIcon, ChildFriendlyIcon, HealingIcon,
    HelpOutlineIcon,
};

const MuiIcon = ({ iconName, ...props }: { iconName: string;[key: string]: unknown }) => {
    const IconComponent = iconComponents[iconName] || HelpOutlineIcon;
    return <IconComponent {...props} />;
};

const muiIconsList: { name: string; component: React.ElementType }[] = [
    { name: "HomeIcon", component: HomeIcon }, { name: "AccountBalanceIcon", component: AccountBalanceIcon },
    { name: "ShoppingCartIcon", component: ShoppingCartIcon }, { name: "FastfoodIcon", component: FastfoodIcon },
    { name: "TrainIcon", component: TrainIcon }, { name: "LocalHospitalIcon", component: LocalHospitalIcon },
    { name: "SchoolIcon", component: SchoolIcon }, { name: "FitnessCenterIcon", component: FitnessCenterIcon },
    { name: "AttachMoneyIcon", component: AttachMoneyIcon }, { name: "TrendingUpIcon", component: TrendingUpIcon },
    { name: "TrendingDownIcon", component: TrendingDownIcon }, { name: "EditIcon", component: EditIcon },
    { name: "DeleteIcon", component: DeleteIcon }, { name: "SettingsIcon", component: SettingsIcon },
    { name: "InfoIcon", component: InfoIcon }, { name: "WarningIcon", component: WarningIcon },
    { name: "CheckCircleIcon", component: CheckCircleIcon }, { name: "CancelIcon", component: CancelIcon },
    { name: "CategoryIcon", component: CategoryIcon }, { name: "LabelIcon", component: LabelIcon },
    { name: "PaletteIcon", component: PaletteIcon }, { name: "BuildIcon", component: BuildIcon },
    { name: "LightbulbIcon", component: LightbulbIcon }, { name: "FlightIcon", component: FlightIcon },
    { name: "HotelIcon", component: HotelIcon }, { name: "LocalGasStationIcon", component: LocalGasStationIcon },
    { name: "PhoneIcon", component: PhoneIcon }, { name: "EmailIcon", component: EmailIcon },
    { name: "PersonIcon", component: PersonIcon }, { name: "GroupIcon", component: GroupIcon },
    { name: "WorkIcon", component: WorkIcon }, { name: "BusinessIcon", component: BusinessIcon },
    { name: "SavingsIcon", component: SavingsIcon }, { name: "ReceiptIcon", component: ReceiptIcon },
    { name: "CreditCardIcon", component: CreditCardIcon }, { name: "MonetizationOnIcon", component: MonetizationOnIcon },
    { name: "EuroSymbolIcon", component: EuroSymbolIcon }, { name: "PaidIcon", component: PaidIcon },
    { name: "PetsIcon", component: PetsIcon }, { name: "BookIcon", component: BookIcon },
    { name: "MusicNoteIcon", component: MusicNoteIcon }, { name: "SportsEsportsIcon", component: SportsEsportsIcon },
    { name: "MovieIcon", component: MovieIcon }, { name: "LocalBarIcon", component: LocalBarIcon },
    { name: "DirectionsCarIcon", component: DirectionsCarIcon }, { name: "ApartmentIcon", component: ApartmentIcon },
    { name: "ChildFriendlyIcon", component: ChildFriendlyIcon }, { name: "HealingIcon", component: HealingIcon },
    { name: "HelpOutlineIcon", component: HelpOutlineIcon },
];

interface IconPickerModalProps {
    open: boolean;
    onClose: () => void;
    onSelectIcon: (iconName: string) => void;
}

const IconPickerModal: React.FC<IconPickerModalProps> = ({ open, onClose, onSelectIcon }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = useMemo(() => {
        return muiIconsList.filter(icon =>
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


// --- Simulated Categories Store ---
// (Em um cenário real, você usaria Zustand, Redux, ou Context API)
const useCategoriesStore = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        try {
            const mockCategories: Category[] = [
                { id: '1', name: 'Alimentação', icon: 'FastfoodIcon', type: 'EXPENSE' },
                { id: '2', name: 'Salário', icon: 'AttachMoneyIcon', type: 'INCOME' },
                { id: '3', name: 'Transporte', icon: 'TrainIcon', type: 'EXPENSE' },
                { id: '4', name: 'Lazer', icon: 'SportsEsportsIcon', type: 'EXPENSE' },
                { id: '5', name: 'Moradia', icon: 'HomeIcon', type: 'EXPENSE' },
            ];
            setCategories(mockCategories);
        } catch (e) {
            setError("Falha ao buscar categorias.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<boolean> => {
        if (!categoryData.name.trim()) {
            setError("O nome da categoria não pode ser vazio.");
            return false;
        }
        if (!categoryData.icon) {
            setError("Por favor, selecione um ícone para a categoria.");
            return false;
        }
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        try {
            const newCategory: Category = {
                ...categoryData,
                id: new Date().toISOString(), // Simple ID for example
                name: categoryData.name.trim(),
            };
            setCategories(prevCategories => [...prevCategories, newCategory]);
            setIsLoading(false);
            return true;
        } catch (e) {
            setError("Falha ao adicionar categoria.");
            setIsLoading(false);
            console.error(e);
            return false;
        }
    };

    return { categories, isLoading, fetchCategories, addCategory, error };
};
// --- End Simulated Categories Store ---

const CategoriesPage = () => {
    const { categories, isLoading, fetchCategories, addCategory, error } = useCategoriesStore();

    const initialCategoryState = { name: '', icon: 'LabelIcon', type: 'EXPENSE' as "INCOME" | "EXPENSE" };
    const [newCategoryData, setNewCategoryData] = useState(initialCategoryState);
    const [searchText, setSearchText] = useState<string>('');
    const [isIconModalOpen, setIsIconModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewCategoryData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (event: React.MouseEvent<HTMLElement>, newType: "INCOME" | "EXPENSE" | null) => {
        if (newType !== null) {
            setNewCategoryData(prev => ({ ...prev, type: newType }));
        }
    };

    const handleIconSelect = (iconName: string) => {
        setNewCategoryData(prev => ({ ...prev, icon: iconName }));
    };

    const handleAddCategory = async () => {
        const success = await addCategory(newCategoryData);
        if (success) {
            setNewCategoryData(initialCategoryState); // Reset form
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const filteredCategories = useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [categories, searchText]);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Card sx={{ maxWidth: 900, m: 'auto' }}>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                        Gerenciar Categorias
                    </Typography>

                    {error && (
                        <Typography color="error" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
                            {error}
                        </Typography>
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
                        />
                        <ToggleButtonGroup
                            value={newCategoryData.type}
                            exclusive
                            onChange={handleTypeChange}
                            aria-label="Tipo da Categoria"
                            size="small"
                            sx={{ height: '40px' }} // Match TextField small size
                        >
                            <ToggleButton value="INCOME" aria-label="Receita">Receita</ToggleButton>
                            <ToggleButton value="EXPENSE" aria-label="Despesa">Despesa</ToggleButton>
                        </ToggleButtonGroup>
                        <Button
                            variant="outlined"
                            onClick={() => setIsIconModalOpen(true)}
                            startIcon={<MuiIcon iconName={newCategoryData.icon} />}
                            size="small"
                            sx={{ height: '40px', minWidth: { xs: '100%', sm: '150px' } }} // Match TextField small size
                        >
                            Ícone
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAddCategory}
                            disabled={isLoading || !newCategoryData.name.trim()}
                            startIcon={<AddCircleOutline />}
                            size="small"
                            sx={{ height: '40px', minWidth: { xs: '100%', sm: '130px' } }} // Match TextField small size
                        >
                            Adicionar
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 2, mb: 1 }}>
                        Categorias Existentes
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

                    {isLoading && categories.length === 0 ? (
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
                                        '&:hover': {
                                            boxShadow: 1, // theme.shadows[1]
                                        }
                                    }}
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                                        </Box>
                                    }
                                >
                                    <MuiIcon iconName={category.icon} sx={{ mr: 2, color: category.type === 'INCOME' ? 'success.main' : 'error.main' }} />
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                        secondary={category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {isLoading && categories.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            <Typography>Atualizando...</Typography>
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