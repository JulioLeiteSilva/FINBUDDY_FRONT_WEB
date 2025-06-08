// src/components/AddTransactionModal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Switch,
  FormControlLabel,
  SelectChangeEvent
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// É ideal que estes tipos venham de um arquivo compartilhado, ex: 'src/types.ts'
// para que a CardPage e outros componentes possam usá-los consistentemente.
interface CardDetails {
  id: string;
  cardName: string;
  bankName: string;
  // ... outros campos do cartão
}

// Configurar Day.js para usar o locale em português
dayjs.locale('pt-br');


// Tipos para o formulário de transação
interface TransactionFormData {
  name: string;
  value: string;
  monthYear: string; // Armazenará a chave do mês, ex: "2025-06"
  day: string;       // Armazenará o dia como string
  category: string;
  bankAccountId: string;
  currency: string;
  isInstallment: boolean;
  installments: string;
}

// Estado inicial do formulário ao abrir
const initialFormData: TransactionFormData = {
  name: '',
  value: '',
  monthYear: dayjs().format('YYYY-MM'), // Padrão para o mês atual
  day: '',
  category: '',
  bankAccountId: '',
  currency: 'BRL',
  isInstallment: false,
  installments: '2', // Inicia com 2 parcelas se o switch for ativado
};

// Opções para os dropdowns
const categoryOptions = ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Compras", "Assinaturas", "Outros"];
const currencyOptions = [
    { value: 'BRL', label: 'BRL - Real Brasileiro' },
    { value: 'USD', label: 'USD - Dólar Americano' },
    { value: 'EUR', label: 'EUR - Euro' },
];
const monthOptions = [
  { value: dayjs().format('YYYY-MM'), label: dayjs().format('MMMM [de] YYYY') },
  { value: dayjs().subtract(1, 'month').format('YYYY-MM'), label: dayjs().subtract(1, 'month').format('MMMM [de] YYYY') }
];

// Props que o componente espera
interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (transactionData: any) => void;
  cards: CardDetails[]; // Recebe a lista de cartões para popular o seletor de conta
}


const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ open, onClose, onSave, cards }) => {
  const [formData, setFormData] = useState<TransactionFormData>(initialFormData);

  // Gera as opções de dia dinamicamente com base no mês selecionado
  const dayOptions = useMemo(() => {
    if (!formData.monthYear) return [];
    const daysInMonth = dayjs(formData.monthYear).daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }));
  }, [formData.monthYear]);

  // Reseta o formulário sempre que o modal abre
  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    // Se o usuário mudar o mês, reseta o dia selecionado para evitar datas inválidas
    if (name === 'monthYear') {
        setFormData(prev => ({ ...prev, monthYear: value, day: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setFormData(prev => ({ 
        ...prev, 
        isInstallment: isChecked,
        // Se desmarcar o parcelamento, volta para 1. Se marcar, define como 2 (mínimo).
        installments: isChecked ? '2' : '1'
    }));
  };

  const handleSubmit = () => {
    // Adicionar mais validações aqui se necessário
    const numberOfInstallments = parseInt(formData.installments, 10);
    if (formData.isInstallment && (numberOfInstallments < 2 || numberOfInstallments > 12)) {
      alert("O número de parcelas deve ser entre 2 e 12.");
      return;
    }
    if (!formData.day || !formData.monthYear) {
      alert("Por favor, selecione um mês e um dia válidos.");
      return;
    }

    const transactionDate = dayjs(`${formData.monthYear}-${formData.day}`).toDate();
    
    let finalInstallmentDate = null;
    if (formData.isInstallment && transactionDate && numberOfInstallments > 1) {
      finalInstallmentDate = dayjs(transactionDate).add(numberOfInstallments - 1, 'month').toDate();
    }
    
    const submissionData = {
        name: formData.name,
        value: parseFloat(formData.value) || 0,
        type: 'EXPENSE',
        date: transactionDate,
        category: formData.category,
        bankAccountId: formData.bankAccountId,
        currency: formData.currency,
        isInstallment: formData.isInstallment,
        installments: formData.isInstallment ? numberOfInstallments : 1,
        finalInstallmentDate: finalInstallmentDate,
        isPaid: false,
    };
    
    console.log("Salvando nova despesa:", submissionData);
    onSave(submissionData);
    onClose();
  };

  // Estilos para remover spinners dos inputs numéricos
  const numberInputStyles = {
    '& input[type=number]': { '-moz-appearance': 'textfield' },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle>Adicionar Nova Despesa</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField name="name" label="Nome da Despesa" value={formData.name} onChange={handleChange} fullWidth margin="dense" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField name="value" label="Valor" type="number" value={formData.value} onChange={handleChange} fullWidth margin="dense" sx={numberInputStyles}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="currency-select-label">Moeda</InputLabel>
              <Select name="currency" labelId="currency-select-label" value={formData.currency} onChange={handleChange} label="Moeda">
                {currencyOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="month-select-label">Mês</InputLabel>
              <Select name="monthYear" labelId="month-select-label" value={formData.monthYear} onChange={handleChange} label="Mês">
                {monthOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth margin="dense" disabled={!formData.monthYear}>
              <InputLabel id="day-select-label">Dia</InputLabel>
              <Select name="day" labelId="day-select-label" value={formData.day} onChange={handleChange} label="Dia">
                {dayOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="category-select-label">Categoria</InputLabel>
              <Select name="category" labelId="category-select-label" value={formData.category} onChange={handleChange} label="Categoria">
                {categoryOptions.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="account-select-label">Cartão / Conta</InputLabel>
              <Select name="bankAccountId" labelId="account-select-label" value={formData.bankAccountId} onChange={handleChange} label="Cartão / Conta">
                {cards.map(card => (<MenuItem key={card.id} value={card.id}>{card.cardName} ({card.bankName})</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={<Switch checked={formData.isInstallment} onChange={handleSwitchChange} name="isInstallment" />}
              label="Compra parcelada?"
            />
          </Grid>
          {formData.isInstallment && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="installments" label="Nº de Parcelas" type="number" value={formData.installments} onChange={handleChange} fullWidth margin="dense" InputProps={{ inputProps: { min: 2, max: 12 } }} sx={numberInputStyles} />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Salvar Despesa</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;