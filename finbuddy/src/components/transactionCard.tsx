import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { TransactionSchemaType } from '../schemas/transactions';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

interface TransactionCardProps {
  transaction: TransactionSchemaType;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const formattedAmount = transaction.value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const formattedDate = dayjs(transaction.date).format('DD/MM/YYYY');

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" component="div">
          {transaction.name}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {formattedDate} - {transaction.category}
        </Typography>
        <Typography variant="body2" color={transaction.type === 'EXPENSE' ? 'error' : 'success'}>
          {formattedAmount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;