import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { CategoryAllocationType } from '../../../schemas/FinancialPlanning';

interface CategoryTableProps {
  data: CategoryAllocationType[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        mês e ano
      </Typography>
      {data.map((item) => {
        const totalBudget = item.value || 0;
        const totalSpent = item.spent || 0;
        const totalPaid = item.paidSpent || 0;
        const pendingToPay = totalSpent - totalPaid;

        // porcentagens
        const paidPercentage = totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0;
        const pendingPercentage = totalBudget > 0 ? (pendingToPay / totalBudget) * 100 : 0;
        const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

        // calculo pras barras
        const displayPaidPercentage = Math.min(paidPercentage, 100);
        const displayPendingPercentage = Math.min(pendingPercentage, Math.max(0, 100 - displayPaidPercentage));

        // Limita as porcentagens para a exibição na barra até 100%
        const isOverBudget = totalSpent > totalBudget && totalBudget > 0;
        const hasPending = pendingToPay > 0;

        // Define as cores com base se o orçamento foi excedido ou não
        const paidColor = isOverBudget ? theme.palette.error.dark : theme.palette.success.dark;
        const pendingColor = isOverBudget ? theme.palette.error.light : theme.palette.success.light;
        const exceededColor = theme.palette.error.main;

        return (
          <Box key={item.category.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {item.category.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  R$ {item.spent ? item.spent.toFixed(2) : 0} de R$ {item.value.toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: isOverBudget ? 'error.main' : 'text.primary' }}>
                  {totalPercentage.toFixed(0)}%
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              display: 'flex',
              overflow: 'hidden',
            }}>

              {/* Barra para o valor PAGO */}
              <Box sx={{
                width: `${displayPaidPercentage}%`,
                backgroundColor: paidColor,
                height: '100%'
              }} />

              {/* Barra para o valor GASTO PENDENTE */}
              {hasPending && (
                <Box sx={{
                  width: `${displayPendingPercentage}%`,
                  backgroundColor: pendingColor,
                  height: '100%'
                }} />
              )}
              {/* Se excedido = barra vermelha */}
              {isOverBudget && totalSpent > totalBudget && (
                <Box sx={{
                  backgroundColor: exceededColor,
                  width: '100%',
                  height: '100%'
                }} />
              )}
            </Box>

            {isOverBudget && (
              <Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
                Excedido em R$ {(item.spent || 0 - item.value).toFixed(2)}
              </Typography>
            )}

            <Box sx={{ mt: 1, fontSize: '0.875rem' }}>
              {/* Legenda de Despesas Pagas */}
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: paidColor }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: paidColor, mr: 1 }} />
                {paidPercentage.toFixed(2)}% Despesas pagas
              </Typography>

              {/* Legenda de Despesas a Pagar */}
              {hasPending && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: pendingColor }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: pendingColor, mr: 1 }} />
                  {pendingPercentage.toFixed(2)}% Despesas a pagar
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
};

export default CategoryTable;