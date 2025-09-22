import { Box, Card, CardContent, Typography, Divider, Grid } from "@mui/material";
import { CategoryForm } from './components/CategoryForm';
import { CategoryList } from './components/CategoryList';
import { CategoryOriginFilter } from './components/CategoryOriginFilter';
import { CategoryNatureFilter } from './components/CategoryNatureFilter';
import { useCategoriesViewModel } from "./CategoriesViewModel";


const CategoriesView = () => {
    const {
        isLoading,
        handleAddCategory,
        processedCategories,
        originFilter,
        setOriginFilter,
        natureFilter,
        setNatureFilter,
    } = useCategoriesViewModel();
    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Card sx={{ m: 'auto' }}>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
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
}

export default CategoriesView;