import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import { TransactionRequestDTOSchemaType, TransactionSchemaType } from '../../../schemas/Transactions';
import { TransactionDetailsModal } from './TransactionDetailsModal'; // Ajuste o caminho
import { DeleteTransaction, UpdateTransaction } from '../../../services/Transactions'; // Ajuste o caminho
import GetMuiIcon from '../../../utils/getMuiIcon'; // Ajuste o caminho
import { formatDate } from './TransactionDetailsModal/utils/transactionUtils'; // Reutilizando nosso utilitário

interface TransactionCardProps {
  transaction: TransactionSchemaType;
  onTransactionUpdate: () => void; // Callback para o pai atualizar a lista
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onTransactionUpdate }) => {
  const [openModal, setOpenModal] = useState(false);

  // Lógica de formatação
  const formattedAmount = transaction.value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Reutilizando o utilitário de data para um código mais limpo
  const formattedDate = formatDate(transaction.date);

  // Lógica de manipulação de dados
  const handleDelete = async (id: string) => {
    await DeleteTransaction(id);
    setOpenModal(false);
    onTransactionUpdate(); // Notifica o componente pai que uma atualização ocorreu
  };

  const handleUpdate = async (updatedTransaction: TransactionRequestDTOSchemaType) => {
    await UpdateTransaction({
      ...updatedTransaction,
      id: transaction.id,
    });
    setOpenModal(false);
    onTransactionUpdate(); // Notifica o componente pai
  };

  // Estilo condicional para o valor
  const amountColor = transaction.type === 'EXPENSE' ? 'error.main' : 'success.main';

  return (
    <>
      <Card
        sx={{
          mb: 1.5,
          minHeight: 90,
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: 3,
          }
        }}
        onClick={() => setOpenModal(true)}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: '12px !important' }}>
          {/* Ícone da Categoria */}
          <Avatar sx={{ bgcolor: amountColor, mr: 1.5 }}>
            <GetMuiIcon iconName={transaction.category || 'Category'} sx={{ color: 'white' }} />
          </Avatar>

          {/* Informações Centrais */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" component="div" sx={{ lineHeight: 1.2 }}>
              {transaction.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              {formattedDate} - {transaction.category}
            </Typography>
            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
              {!transaction.isPaid && <Chip label="Não Pago" color="warning" size="small" variant="outlined" />}
              {transaction.isRecurring && <Chip label="Recorrente" color="info" size="small" variant="outlined" />}
            </Box>
          </Box>

          {/* Valor da Transação */}
          <Box sx={{ textAlign: 'right', ml: 1 }}>
            <Typography variant="body1" fontWeight="bold" color={amountColor}>
              {transaction.type === 'EXPENSE' ? `- ${formattedAmount}` : `+ ${formattedAmount}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* O Modal continua o mesmo */}
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
