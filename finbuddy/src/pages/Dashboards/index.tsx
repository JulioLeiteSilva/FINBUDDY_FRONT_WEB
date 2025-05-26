// src/pages/Transactions/index.tsx (ou onde seu componente Dashboard está)
import React from 'react'; // Removido useState, useEffect, useMemo se não usados diretamente aqui
import { Box, Container, Typography, Button } from '@mui/material'; // Adicionado Box
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../services/firebase'; // Verifique se este é o client auth do Firebase

// Importar o novo hook e os tipos que ele retorna/usa
import { useDashboardData, ProcessedTransaction, MonthlyData } from '../../hooks/useDashboardData'; // Ajuste o caminho

// Importar os componentes de gráfico (verifique os caminhos)
import SummaryCards from './components/SummaryCards';
import ExpenseByCategory from './components/ExpenseByCategory';
import RevenueFlowTrendChart from './components/RevenueFlowTrendChart';
import MonthlyComparisonBarChart from './components/MonthylComparisonChart'; // Atenção ao nome do arquivo/componente

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const {
    isLoading,
    transactionsForCharts, // Esta é ProcessedTransaction[]
    dataForMonthlyBarChart,  // Esta é MonthlyData[]
    // Adicionar 'error' aqui se o hook o retornar
  } = useDashboardData();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6">Carregando dados do dashboard...</Typography>
      </Container>
    );
  }

  // TODO: Adicionar tratamento de erro aqui se o hook 'useDashboardData' retornar um estado de erro

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#333', flexGrow: 1 }}>
          Dashboard {user?.email ? `- ${user.email.split('@')[0]}` : ''}
        </Typography>
        <Button variant="outlined" onClick={handleLogout} size="small">
          Sair
        </Button>
      </Box>
      
      {/* Futuramente, o DateRangeSelector poderia chamar uma função como setDateRange retornada pelo hook */}
      <hr style={{ margin: '20px 0' }} />

      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <SummaryCards data={transactionsForCharts} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, backgroundColor: '#fff', borderRadius: '8px', p: 2, boxShadow: 1 }}>
          <ExpenseByCategory transactions={transactionsForCharts} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, backgroundColor: '#fff', borderRadius: '8px', p: 2, boxShadow: 1 }}>
          <MonthlyComparisonBarChart data={dataForMonthlyBarChart} />
        </Box>
      </Box>

      <Box sx={{ backgroundColor: '#fff', borderRadius: '8px', p: 2, boxShadow: 1 }}>
        <RevenueFlowTrendChart transactions={transactionsForCharts} />
      </Box>
    </Box>
  );
};

export default Dashboard;