import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TransactionSchemaType } from '../../../../schemas/Transactions';
import GetMuiIcon from '../../../../utils/getMuiIcon';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { firestoreTimestampToDate } from '../../../Transactions/components/TransactionDetailsModal/utils/transactionUtils';

interface RecentTransactionsProps {
  transactions: TransactionSchemaType[];
  formatCurrency: (value: number) => string;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  formatCurrency,
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
      onClick={() => navigate('/transactions')}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Transações Recentes
        </Typography>
        {transactions.map((transaction) => (
          <Box
            key={transaction.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GetMuiIcon iconName={transaction.category} />
              <Box>
                <Typography variant="body2">{transaction.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Typography variant="caption" color="textSecondary">
                    {dayjs(firestoreTimestampToDate(transaction.date)).format('DD/MM/YYYY')}
                  </Typography>
                  {!transaction.isPaid && (
                    <Chip 
                      label="Não Pago" 
                      color="warning" 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                  {transaction.isRecurring && (
                    <Chip 
                      label="Recorrente" 
                      color="info" 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <Typography
              color={transaction.type === 'INCOME' ? 'success.main' : 'error.main'}
              fontWeight="bold"
            >
              {formatCurrency(transaction.value)}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions; 