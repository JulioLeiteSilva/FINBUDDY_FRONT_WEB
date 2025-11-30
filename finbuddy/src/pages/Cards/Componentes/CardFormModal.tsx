/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/CardFormModal.tsx
import React, { useState, useEffect } from "react";
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
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCardFlag } from "../../../enums/CreditCardFlag";
import { CreateCreditCard } from "../../../services/CreditCard/createCreditCard";
import { useBankAccountStore } from "../../../store/bankAccountStore";
import {
  CreateCreditCardRequestType,
  CreditCardFormSchema,
  CreditCardFormType,
} from "../../../schemas/CreditCard";
import { CurrencyInput } from "../../../components/CurrencyInput/CurrencyInput";
// Props que o componente espera
interface CardFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (cardData: CreateCreditCardRequestType) => void;
  initialData?: any | null; // Dados do cartão para o modo de edição
}

const CardFormModal: React.FC<CardFormModalProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreditCardFormType>({
    resolver: zodResolver(CreditCardFormSchema),
    defaultValues: {
      name: "",
      flag: CreditCardFlag.VISA,
      closingDay: 1,
      dueDate: 1,
      limit: 0,
      bankAccountId: "",
    },
  });

  const { bankAccounts, fetchBankAccounts } = useBankAccountStore();
  const isEditMode = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  useEffect(() => {
    if (initialData && open) {
      reset({
        name: initialData.cardName,
        flag: initialData.brand as CreditCardFlag,
        closingDay: initialData.closingDay,
        dueDate: dayjs(initialData.dueDate).date(),
        limit: initialData.limitTotal,
        bankAccountId: initialData.bankAccountId,
      });
    } else if (!initialData && open) {
      reset({
        name: "",
        flag: CreditCardFlag.VISA,
        closingDay: 1,
        dueDate: 1,
        limit: 0,
        bankAccountId: "",
      });
    }
  }, [initialData, open, reset]);

  const onSubmit = async (data: CreditCardFormType) => {
    try {
      setIsSubmitting(true);
      if (isEditMode) {
        // TODO: Implement edit functionality
        console.log("Edit mode not implemented yet");
      } else {
        await CreateCreditCard(data);
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Error saving credit card:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {isEditMode ? "Editar Cartão" : "Adicionar Novo Cartão"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {/* Linha 1: Nome, Banco, Bandeira */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    label="Nome do Cartão"
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="bankAccountId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={!!errors.bankAccountId}
                  >
                    <InputLabel>Banco</InputLabel>
                    <Select {...field} label="Banco">
                      {bankAccounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bankAccountId && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ ml: 1.5, mt: 0.5 }}
                      >
                        {errors.bankAccountId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="flag"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense" error={!!errors.flag}>
                    <InputLabel>Bandeira</InputLabel>
                    <Select {...field} label="Bandeira">
                      {Object.values(CreditCardFlag).map((flag) => (
                        <MenuItem key={flag} value={flag}>
                          {flag}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.flag && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ ml: 1.5, mt: 0.5 }}
                      >
                        {errors.flag.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Linha 2: Dia de Fechamento, Dia de Vencimento */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="closingDay"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={!!errors.closingDay}
                  >
                    <InputLabel>Dia de Fechamento</InputLabel>
                    <Select {...field} label="Dia de Fechamento">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {errors.closingDay && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ ml: 1.5, mt: 0.5 }}
                      >
                        {errors.closingDay.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={!!errors.dueDate}
                  >
                    <InputLabel>Dia de Vencimento</InputLabel>
                    <Select {...field} label="Dia de Vencimento">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {errors.dueDate && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ ml: 1.5, mt: 0.5 }}
                      >
                        {errors.dueDate.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Linha 3: Limite */}
            <CurrencyInput
              control={control}
              name="limit"
              label="Limite do Cartão"
              margin="dense"
              fullWidth
              error={!!errors.limit}
              helperText={errors.limit?.message}
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting
            ? "Processando..."
            : isEditMode
            ? "Salvar Alterações"
            : "Registrar Cartão"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardFormModal;
