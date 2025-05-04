import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { TransactionRequestDTOSchemaType, TransactionSchemaType } from '../schemas/transactions';
import TransactionDetailsModal from '../pages/Transactions/components/TransactionsDetailsModal'; // ajuste o path!

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

interface TransactionCardProps {
  transaction: TransactionSchemaType;
}

type dateType = {
  _seconds: number;
  _nanoseconds: number;
};

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const [openModal, setOpenModal] = useState(false);

  const formattedAmount = transaction.value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const date: dateType = transaction.date as unknown as dateType;
  const formattedDate = dayjs(date._seconds * 1000).format('DD/MM/YYYY');

  const handleDelete = (id: string) => {
    console.log('Deletar:', id);
    setOpenModal(false);
    // Aqui você pode chamar sua lógica real de deletar
  };

  const handleUpdate = (updatedTransaction: TransactionRequestDTOSchemaType) => {
    console.log('Atualizar:', updatedTransaction);
    setOpenModal(false);
    // Aqui você pode chamar sua lógica real de update
  };

  return (
    <>
      <Card sx={{ mb: 1, cursor: 'pointer' }} onClick={() => setOpenModal(true)}>
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

      <TransactionDetailsModal
        transaction={transaction}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default TransactionCard;
