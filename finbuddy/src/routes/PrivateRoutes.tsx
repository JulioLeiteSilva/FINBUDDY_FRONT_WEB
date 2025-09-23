import { Routes, Route, useLocation } from 'react-router-dom';
import { HomeView } from '../pages/Home';
import NotFound from '../pages/NotFound';
import { Box, Modal } from '@mui/material';
import { SideBar } from '../components/';
import { Content } from '../components';
import TransactionsPageView from '../pages/Transactions/TransactionPageView';
import { useState, useEffect, useCallback } from 'react';
import { NewTransactionModal } from '../components';
import { CreateTransaction } from '../services/Transactions';
import { CreateTransactionType } from '../schemas/Transactions';
import { BankAccountView } from '../pages/BankAccount';
import { CategoriesView } from '../pages/Categories';
import { DashboardView } from '../pages/Dashboards';
import { CardsView } from '../pages/Cards';
import { PlanningView } from '../pages/Planning';


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

  const handleCreateNewTransaction = useCallback((newTransaction: CreateTransactionType) => {
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
      // case '/dashboard':
      //   setTitle('Dashboard');
      //   break;
      // case '/cards':
      //   setTitle('Cartões de Crédito');
      //   break;
      case '/planning':
        setTitle('Planejamento');
        break;
      default:
        setTitle('Página não encontrada');
        break;

    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <SideBar />
      <Content title={title} onOpenNewTransactionModal={handleOpenNewTransactionModal}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/bank-accounts" element={<BankAccountView />} />
          <Route path="/transactions" element={<TransactionsPageView />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/dashboard" element={<DashboardView />} />
          {/* <Route path="/cards" element={<CardsView />} /> */}
          <Route path="/planning" element={<PlanningView />} />
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
