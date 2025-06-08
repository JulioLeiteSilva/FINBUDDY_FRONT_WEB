import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

interface SummaryCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  formatCurrency: (value: number) => string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  formatCurrency,
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4, flexWrap: 'nowrap' }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Saldo Total
            </Typography>
            <Typography variant="h5" component="div">
              {formatCurrency(totalBalance)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Receitas do Mês
            </Typography>
            <Typography variant="h5" component="div" color="success.main">
              {formatCurrency(monthlyIncome)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Despesas do Mês
            </Typography>
            <Typography variant="h5" component="div" color="error.main">
              {formatCurrency(monthlyExpenses)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards; 