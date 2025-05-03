// src/routes/PrivateRoutes.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import { Box, Modal } from '@mui/material';
import SideBar from '../components/sideBar';
import Content from '../components/content';
import TransactionsPage from '../pages/Transactions';
import { useState, useEffect, useCallback } from 'react';
import NewTransactionModal from '../components/newTransactionModal';
import { CreateTransaction } from '../services/Transactions/createTransaction';
import { TransactionRequestDTOSchemaType } from '../schemas/transactions';


const PrivateRoutes = () => {
  const location = useLocation();
  const [title, setTitle] = useState<string>('');
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState<boolean>(false);

  const handleOpenNewTransactionModal = useCallback(() => {
    setIsNewTransactionModalOpen(true);
  }, []);

  const handleCloseNewTransactionModal = useCallback(() => {
    setIsNewTransactionModalOpen(false);
  }, []);

  const handleCreateNewTransaction = useCallback((newTransaction: TransactionRequestDTOSchemaType) => {
    CreateTransaction(newTransaction);
    handleCloseNewTransactionModal();
  }, [handleCloseNewTransactionModal]);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('Home');
        break;
      case '/transactions':
        setTitle('Transações');
        break;
      // Adicione mais casos conforme suas rotas
      default:
        setTitle('Página não encontrada'); // Ou um título padrão
        break;
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <SideBar />
      <Content title={title} onOpenNewTransactionModal={handleOpenNewTransactionModal}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>

      <Modal
        open={isNewTransactionModalOpen}
        onClose={handleCloseNewTransactionModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <NewTransactionModal onClose={handleCloseNewTransactionModal} onCreateNew={handleCreateNewTransaction} />
      </Modal>
    </Box>
  );
};

export default PrivateRoutes;
