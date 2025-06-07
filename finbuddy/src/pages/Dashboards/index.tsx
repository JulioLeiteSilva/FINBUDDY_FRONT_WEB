import React, { useState } from 'react';
import { Box, Container, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { useDashboardData} from '../../hooks/useDashboardData';

import SummaryCards from './components/SummaryCards';
import ExpenseByCategory from './components/ExpenseByCategory';
import RevenueFlowTrendChart from './components/RevenueFlowTrendChart';
import MonthlyComparisonBarChart from './components/MonthylComparisonChart';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

const Dashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const {
    isLoading,
    transactionsForCharts,
    dataForMonthlyBarChart,
  } = useDashboardData();

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => prev.add(1, 'month'));
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6">Carregando dados do dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2.5 }}>
        <IconButton onClick={handlePreviousMonth} aria-label="Mês anterior">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ minWidth: { xs: '160px', sm: '200px' }, textAlign: 'center', textTransform: 'capitalize' }}>
          {selectedMonth.format('MMMM [de] YYYY')}
        </Typography>
        <IconButton onClick={handleNextMonth} aria-label="Próximo mês">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <SummaryCards data={transactionsForCharts} selectedMonth={selectedMonth} />
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
          <ExpenseByCategory transactions={transactionsForCharts} selectedMonth={selectedMonth} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, backgroundColor: '#fff', borderRadius: '8px', p: 2, boxShadow: 1 }}>
          <MonthlyComparisonBarChart data={dataForMonthlyBarChart} selectedMonth={selectedMonth} />
        </Box>
      </Box>

      <Box sx={{ backgroundColor: '#fff', borderRadius: '8px', p: 2, boxShadow: 1, mb: 5 }}>
        <RevenueFlowTrendChart transactions={transactionsForCharts} selectedMonth={selectedMonth} />
      </Box>
    </Box>
  );
};

export default Dashboard;