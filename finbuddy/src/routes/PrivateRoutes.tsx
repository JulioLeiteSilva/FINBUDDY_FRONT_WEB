// src/routes/PrivateRoutes.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import { Box, Modal } from '@mui/material';
import { SideBar } from '../components/';
import { Content }  from '../components';
import TransactionsPage from '../pages/Transactions';
import { useState, useEffect, useCallback } from 'react';
import { NewTransactionModal } from '../components';
import { CreateTransaction } from '../services/Transactions';
import { TransactionRequestDTOSchemaType } from '../schemas/transactions';
import BankAccountsPage from '../pages/BankAccount';
import CategoriesPage from '../pages/Categories';


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
      case '/bank-accounts':
        setTitle('Contas');
        break;
      case '/categories':
        setTitle('Categorias');
        break;
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
          <Route path="/bank-accounts" element={<BankAccountsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
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
