import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { TransactionRequestDTOSchemaType, TransactionSchemaType } from '../../../schemas/Transactions';
import TransactionDetailsModal from './TransactionsDetailsModal';
import { DeleteTransaction, UpdateTransaction } from '../../../services/Transactions';

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

  const handleDelete = async (id: string) => {
    await DeleteTransaction(id);
    setOpenModal(false);
    // Aqui você pode chamar sua lógica real de deletar
  };

  const handleUpdate = async (updatedTransaction: TransactionRequestDTOSchemaType) => {
    await UpdateTransaction({
      ...updatedTransaction,     // todos os novos campos
      id: transaction.id,        // adiciona o id da transação que está sendo editada
    });
    setOpenModal(false);
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
