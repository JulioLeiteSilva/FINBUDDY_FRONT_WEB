import { Box, Typography, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';

import CardList from './Componentes/CardList';

import AddTransactionModal from './Componentes/AddTransactionModal';
import CardFormModal from './Componentes/CardFormModal';
import CardDetailsModal from './Componentes/CardInvoiceModal';
import RecentTransactionsList from './Componentes/RecentTransactionsList';
import { useCardsViewModel } from './CardsViewModel';

const CardsView = () => {
    const {
        mappedCards,
        filteredTransactions,
        isFormModalOpen,
        isTransactionModalOpen,
        detailsCard,
        cardToEdit,
        handleOpenAddCardModal,
        handleOpenEditCardModal,
        handleCloseFormModal,
        handleSaveCard,
        handleViewDetailsClick,
        handleCloseDetailsModal,
        handleOpenTransactionModal,
        handleCloseTransactionModal,
        handleSaveTransaction,
        creditCards,
    } = useCardsViewModel();

    return (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, minHeight: '100vh' }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
                <Typography variant="h4" component="h1">
                    Meus Cartões
                </Typography>
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenAddCardModal} sx={{ borderRadius: '8px', padding: '10px 20px', textTransform: 'none', fontSize: '1rem' }}>
                    Novo Cartão
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <CardList
                    cards={mappedCards}
                    onViewDetailsClick={handleViewDetailsClick}
                    onEditClick={handleOpenEditCardModal}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
                <Button variant="contained" size="medium" startIcon={<AddIcon />} onClick={handleOpenTransactionModal} sx={{ textTransform: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '0.9rem', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)' }}>
                    Adicionar Nova Transação
                </Button>
            </Box>

            <Box>
                <RecentTransactionsList transactions={filteredTransactions} />
            </Box>

            <CardDetailsModal
                open={!!detailsCard}
                onClose={handleCloseDetailsModal}
                card={detailsCard}
                transactions={filteredTransactions}
            />

            <CardFormModal
                open={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSave={handleSaveCard}
                initialData={cardToEdit}
            />

            <AddTransactionModal
                open={isTransactionModalOpen}
                onClose={handleCloseTransactionModal}
                onSave={handleSaveTransaction}
                cards={creditCards}
            />

        </Box>
    );
}

export default CardsView;
