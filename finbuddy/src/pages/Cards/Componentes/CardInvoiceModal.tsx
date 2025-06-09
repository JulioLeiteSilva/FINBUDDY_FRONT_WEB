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
import { CardDetails, ProcessedTransaction } from '../utils/types';
import { TransactionItem } from '../utils/TransactionItem';
import { formatCurrency } from '../utils/formatters';
import { set } from 'react-hook-form';
import { PayCreditCardInvoice } from '../../../services/CreditCardInvoice/payCreditCardInvoice';
import { useBankAccountStore } from '../../../store/bankAccountStore';

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
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const { bankAccounts } = useBankAccountStore();
  console.log(card)

  useEffect(() => {
    if (card) {
      // Find the current invoice or the most recent one
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const currentInvoice = card.invoices.find(inv => 
        inv.month === currentMonth && inv.year === currentYear
      ) || card.invoices[card.invoices.length - 1];
      console.log(currentInvoice)

      if (currentInvoice) {
        setSelectedMonth(new Date(currentInvoice.year, currentInvoice.month - 1));
      }
    }
  }, [card]);

  const transactions = transactionsProp || [];

  const handleNextMonth = () => setSelectedMonth(prev => dayjs(prev).add(1, 'month').toDate());
  const handlePrevMonth = () => setSelectedMonth(prev => dayjs(prev).subtract(1, 'month').toDate());
  const handleAddNewTransaction = () => console.log("Abrir modal para adicionar nova transação para o cartão:", card?.cardName);
  const handlePayInvoice = () => console.log("Ação para pagar a fatura do cartão:", card?.cardName);

  const currentInvoice = useMemo(() => {
    if (!card) return null;
    return card.invoices.find(inv => 
      inv.month === selectedMonth.getMonth() + 1 && 
      inv.year === selectedMonth.getFullYear()
    );
  }, [card, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    if (!card || !currentInvoice) return [];
    return transactions
      .filter(tx => 
        tx.cardId === card.id && 
        tx.invoiceId === currentInvoice.id
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, card, currentInvoice]);

  const { isAfterClosingDate, invoiceTotalForMonth } = useMemo(() => {
    if (!card || !currentInvoice) return { isAfterClosingDate: false, invoiceTotalForMonth: 0 };

    const closingDateForMonth = dayjs(selectedMonth).date(card.closingDay);
    const today = dayjs();

    const total = filteredTransactions.reduce((sum, tx) => tx.value + sum, 0);

    return {
      isAfterClosingDate: today.isAfter(closingDateForMonth, 'day'),
      invoiceTotalForMonth: total
    };
  }, [card, currentInvoice, selectedMonth, filteredTransactions]);

  const handleOpenConfirmDialog = () => {
    setIsConfirmingPayment(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmingPayment(false);
  };

  const handleConfirmPayment = async () => {
    if (!card || !currentInvoice) return;

    try {
      setIsPaying(true);
      // Get the first bank account as default (you might want to add a selection UI for this)
      const defaultBankAccount = bankAccounts[0];
      if (!defaultBankAccount) {
        throw new Error('Nenhuma conta bancária disponível para pagamento');
      }

      await PayCreditCardInvoice({
        cardId: card.id,
        invoiceId: currentInvoice.id,
        bankAccountId: defaultBankAccount.id
      });

      handleCloseConfirmDialog();
      onClose();
    } catch (error) {
      console.error('Erro ao pagar fatura:', error);
    } finally {
      setIsPaying(false);
    }
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
            <Grid size={{ xs: 6, sm: 4, md:4 }}>
              <Typography variant="caption" color="text.secondary">Fechamento</Typography>
              <Typography>Dia {card.closingDay}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md:4 }}>
              <Typography variant="caption" color="text.secondary">Vencimento</Typography>
              <Typography>Dia {card.dueDate}</Typography>
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
        
        {currentInvoice && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Status da Fatura: {currentInvoice.status}
            </Typography>
            <Typography>
              Total: {formatCurrency(currentInvoice.total)}
            </Typography>
          </Box>
        )}
        
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
          {currentInvoice && (currentInvoice.status === 'CLOSED' || currentInvoice.status === 'OVERDUE') && (
            <Button onClick={handleOpenConfirmDialog} variant='contained'>Pagar Fatura</Button>
          )}
      </DialogActions>
    </Dialog>

    <Dialog
    open={isConfirmingPayment}
    onClose={handleCloseConfirmDialog}
    >
      <DialogTitle>Confirmar Pagamento</DialogTitle>
      <DialogContent>
        <Typography>
          Você tem certeza que deseja pagar a fatura do cartão <strong>{formatCurrency(invoiceTotalForMonth)}</strong> para o cartão <strong>{card.cardName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseConfirmDialog} disabled={isPaying}>Cancelar</Button>
        <Button 
          onClick={handleConfirmPayment} 
          variant="contained" 
          color="primary" 
          autoFocus
          disabled={isPaying}
        >
          {isPaying ? 'Processando...' : 'Confirmar Pagamento'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default CardDetailsModal;