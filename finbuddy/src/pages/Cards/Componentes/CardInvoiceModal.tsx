// src/components/CardDetailsModal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Divider, List, Grid, Button, DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');


// Importando de seus arquivos centralizados (ajuste os caminhos se necessário)
import { ProcessedTransaction } from '../utils/TransactionItem';
import { CardDetails } from '../utils/types';
import { TransactionItem } from '../utils/TransactionItem';
import { formatCurrency } from '../utils/formatters';
import { set } from 'react-hook-form';

// Dados mockados para que o modal funcione de forma isolada para testes
const mockModalTransactions: ProcessedTransaction[] = [
    { id: 'modal-tx-1', name: 'Compra Online Amazon', category: 'Compras', value: 125.50, type: 'expense', date: dayjs('2025-05-20').toDate(), isPaid: true, bankAccountId: 'mock-card-id' },
    { id: 'modal-tx-2', name: 'Uber Viagem', category: 'Transporte', value: 32.80, type: 'expense', date: dayjs('2025-05-18').toDate(), isPaid: true, bankAccountId: 'mock-card-id' },
    { id: 'modal-tx-3', name: 'iFood', category: 'Alimentação', value: 75.90, type: 'expense', date: dayjs('2025-05-15').toDate(), isPaid: true, bankAccountId: 'mock-card-id' },
];

interface CardDetailsModalProps {
  open: boolean;
  onClose: () => void;
  card: CardDetails | null;
  transactions?: ProcessedTransaction[];
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  open,
  onClose,
  card,
  transactions: transactionsProp
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  // NOVO: Estado para controlar o modal de confirmação de pagamento
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  useEffect(() => {
    if (card) {
      setSelectedMonth(card.dueDate);
    } else {
      setSelectedMonth(new Date());
    }
  }, [card]);

  const transactions = transactionsProp && transactionsProp.length > 0
                       ? transactionsProp
                       : mockModalTransactions;

  const handleNextMonth = () => setSelectedMonth(prev => dayjs(prev).add(1, 'month').toDate());
  const handlePrevMonth = () => setSelectedMonth(prev => dayjs(prev).subtract(1, 'month').toDate());
  const handleAddNewTransaction = () => console.log("Abrir modal para adicionar nova transação para o cartão:", card?.cardName);
  const handlePayInvoice = () => console.log("Ação para pagar a fatura do cartão:", card?.cardName);


  const filteredTransactions = useMemo(() => {
    if (!card) return [];
    const useInternalMocks = !transactionsProp || transactionsProp.length === 0;
    return transactions
      .filter(tx =>
        (useInternalMocks ? true : tx.bankAccountId === card.id) && 
        dayjs(tx.date).isSame(selectedMonth, 'month')
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, transactionsProp, card, selectedMonth]);

  const { isAfterClosingDate, invoiceTotalForMonth } = useMemo(() => {
    if (!card) return { isAfterClosingDate: false, invoiceTotalForMonth: 0 };

    const closingDateForMonth = dayjs(selectedMonth).date(card.closingDay);
    const today = dayjs();

    const total = filteredTransactions.reduce((sum ,tx) => tx.value + sum, 0);

    return {
      isAfterClosingDate: today.isAfter(closingDateForMonth, 'day'),
      invoiceTotalForMonth: total
    };
  }, [card, selectedMonth, filteredTransactions]);

  const handleOpenConfirmDialog = () => {
    setIsConfirmingPayment(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmingPayment(false);
  };

  const handleConfirmPayment = () => {
    console.log("CONFIRMADO: Fatura paga no valor de ${formatCurrency(InvoiceTotalForMonth)} para o cartão:", card?.cardName);
    handleCloseConfirmDialog();
    onClose(); 
  };

  if (!card) return null;


  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { height: {xs: '100%', md: '90vh'}, borderRadius: {xs:0, md:'12px'} } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {card.cardName}
        <IconButton onClick={onClose} aria-label="fechar"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* --- SEÇÃO DE INFORMAÇÕES DO CARTÃO COM NOVO LAYOUT --- */}
        <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: '8px', mb: 3 }}>
          <Grid container spacing={2}>
            {/* Linha 1: Banco, Bandeira e Limite */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Banco</Typography>
              <Typography>{card.bankName}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Bandeira</Typography>
              <Typography sx={{textTransform: 'capitalize'}}>{card.brand.toLowerCase()}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Limite</Typography>
              <Typography>{formatCurrency(card.limitTotal)}</Typography>
            </Grid>
            {/* Linha 2: Data de Fechamento e Vencimento */}
            <Grid size={{ xs: 6, sm: 4, md:4 }}> {/* md:4 para alinhar com a coluna acima */}
              <Typography variant="caption" color="text.secondary">Fechamento</Typography>
              <Typography>Dia {card.closingDay}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md:4 }}>
              <Typography variant="caption" color="text.secondary">Vencimento</Typography>
              <Typography>Dia {dayjs(card.dueDate).format('DD')}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* --- SEÇÃO DE TRANSAÇÕES DA FATURA --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
            Fatura de {dayjs(selectedMonth).format('MMMM')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevMonth} size="small"><ChevronLeftIcon /></IconButton>
            <Typography sx={{ width: '130px', textAlign: 'center', fontWeight: 500, textTransform: 'capitalize' }}>
              {dayjs(selectedMonth).format('MMMM [de] YYYY')}
            </Typography>
            <IconButton onClick={handleNextMonth} size="small"><ChevronRightIcon /></IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {filteredTransactions.length > 0 ? (
          <List disablePadding>
            {filteredTransactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <TransactionItem transaction={transaction} />
                {index < filteredTransactions.length - 1 && <Divider variant="inset" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
            <Typography>Nenhuma transação na fatura de {dayjs(selectedMonth).format('MMMM de YYYY')}.</Typography>
          </Box>
        )}
      </DialogContent>
      {/* Botões de Ação do Modal */}
      <DialogActions sx={{ p: '16px 24px' }}>
          <Box sx={{flexGrow: 1}} /> {/* Spacer para empurrar botões */}
          <Button onClick={onClose} color="inherit">Fechar</Button>
          {isAfterClosingDate && invoiceTotalForMonth > 0 && (
            <Button onClick={handleOpenConfirmDialog} variant='contained'>Pagar Fatura
            </Button>
          )}
          
      </DialogActions>
    </Dialog>

    <Dialog
    open= {isConfirmingPayment}
    onClose={handleCloseConfirmDialog}
    >
      <DialogTitle>Confirmar Pagamento</DialogTitle>
      <DialogContent>
        <Typography>
          Você tem certeza que deseja pagar a fatura do cartão <strong>{formatCurrency(invoiceTotalForMonth)}</strong> para o cartão <strong>{card.cardName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
        <Button onClick={handleConfirmPayment} variant="contained" color="primary" autoFocus>
          Confirmar Pagamento
          </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default CardDetailsModal;