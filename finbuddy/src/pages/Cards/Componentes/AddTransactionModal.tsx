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
  Box,
  Typography,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useCategoriesStore } from '../../../store/categoriesStore';
import { CreateInvoiceTransaction } from '../../../services/Transactions/createInvoiceTransaction';
import GetMuiIcon from '../../../utils/getMuiIcon';
import { TransactionFrequency } from '../../../enums';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCardType } from '../../../schemas/CreditCard';
import { CreateIncomeOrExpenseRequestType, CreateInvoiceRequestType, CreateTransactionSchema, CreateTransactionType } from '../../../schemas/Transactions';
import { CurrencyInput } from '../../../components/CurrencyInput/CurrencyInput';

// É ideal que estes tipos venham de um arquivo compartilhado, ex: 'src/types.ts'
// para que a CardPage e outros componentes possam usá-los consistentemente.

// Configurar Day.js para usar o locale em português
dayjs.locale('pt-br');

// Props que o componente espera
interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (transactionData: CreateIncomeOrExpenseRequestType) => void;
  cards: CreditCardType[];
  invoiceId?: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  open, 
  onClose, 
  onSave, 
  cards,
  invoiceId 
}) => {
  const { categories, defaultCategories, fetchCategories } = useCategoriesStore();
  const [numberOfInstallments, setNumberOfInstallments] = useState(1);

  const defaultCard = cards[0];

  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<CreateTransactionType>({
    defaultValues: {
      name: '',
      value: 0,
      category: '',
      date: new Date(),
      type: 'INVOICE',
      isRecurring: false,
      frequency: null,
      startDate: null,
      endDate: null,
      isPaid: false,
      currency: 'BRL',
      bankAccountId: defaultCard?.bankAccountId || '',
      creditCardId: defaultCard?.id || '',
    },
    resolver: zodResolver(CreateTransactionSchema)
  });

  const isRecurring = watch('isRecurring');

  // Filtra apenas as categorias de despesa
  const expenseCategories = useMemo(() => {
    return [...categories, ...defaultCategories].filter(category => category.type === 'EXPENSE');
  }, [categories, defaultCategories]);

  // Reseta o formulário sempre que o modal abre
  useEffect(() => {
    if (open) {
      reset({
        name: '',
        value: 0,
        category: '',
        date: new Date(),
        type: 'INVOICE',
        isRecurring: false,
        frequency: null,
        startDate: null,
        endDate: null,
        isPaid: false,
        currency: 'BRL',
        bankAccountId: defaultCard?.bankAccountId || '',
        creditCardId: defaultCard?.id || '',
      });
      setNumberOfInstallments(1);
      fetchCategories();
    }
  }, [open, fetchCategories, reset, defaultCard, invoiceId]);

  const onSubmit = async (formData: CreateTransactionType) => {
    try {
      // Se for parcelado, ajusta as datas e frequência
      if (formData.isRecurring) {
        formData.frequency = TransactionFrequency.MONTHLY;
        formData.startDate = formData.date;
        formData.endDate = dayjs(formData.date).add(numberOfInstallments - 1, 'month').toDate();
      }

      await CreateInvoiceTransaction(formData as CreateInvoiceRequestType);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação. Por favor, tente novamente.');
    }
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome da Despesa"
                    fullWidth
                    margin="dense"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CurrencyInput
                control={control}
                name="value"
                label="Valor"
                margin="dense"
                fullWidth
                error={!!errors.value}
                helperText={errors.value?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data"
                    type="date"
                    fullWidth
                    margin="dense"
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    InputLabelProps={{ shrink: true }}
                    value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="creditCardId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense" error={!!errors.creditCardId}>
                    <InputLabel id="credit-card-select-label">Cartão de Crédito</InputLabel>
                    <Select
                      {...field}
                      labelId="credit-card-select-label"
                      label="Cartão de Crédito"
                      onChange={(e) => {
                        const selectedCard = cards.find(card => card.id === e.target.value);
                        field.onChange(e.target.value);
                        if (selectedCard) {
                          control._formValues.bankAccountId = selectedCard.bankAccountId;
                        }
                      }}
                    >
                      {cards.map(card => (
                        <MenuItem key={card.id} value={card.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>{card.name} - {card.flag}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.creditCardId && <FormHelperText>{errors.creditCardId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense" error={!!errors.category}>
                    <InputLabel id="category-select-label">Categoria</InputLabel>
                    <Select
                      {...field}
                      labelId="category-select-label"
                      label="Categoria"
                    >
                      {expenseCategories.map(category => (
                        <MenuItem key={category.id} value={category.icon}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GetMuiIcon iconName={category.icon} />
                            <Typography>{category.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="isRecurring"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          if (!e.target.checked) {
                            setNumberOfInstallments(1);
                          }
                        }}
                      />
                    }
                    label="Compra parcelada?"
                  />
                )}
              />
            </Grid>
            {isRecurring && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Número de Parcelas"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={numberOfInstallments}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 12) {
                      setNumberOfInstallments(value);
                    }
                  }}
                  InputProps={{ inputProps: { min: 1, max: 12 } }}
                  sx={numberInputStyles}
                />
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">Salvar Despesa</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;