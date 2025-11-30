import { NewBankAccountModalProps } from "./NewBankAccountModalModel";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  InputAdornment,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { AccountType } from "../../../../enums/accountType";
import { useNewBankAccountModalViewModel } from "./NewBankAccountModalViewModel";
import { getAccountTypeLabel } from "../utils/bankAccountUtils";
import { CurrencyInput } from "../../../../components/CurrencyInput/CurrencyInput";

const NewBankAccountModal = (props: NewBankAccountModalProps) => {
  const { onClose } = props;
  const {
    register,
    handleSubmit,
    errors,
    control,
    banks,
    loadingBanks,
    onSubmit,
  } = useNewBankAccountModalViewModel(props);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nova Conta Bancária</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Preencha os detalhes da nova conta.
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          fullWidth
          variant="outlined"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <CurrencyInput
          control={control}
          name="balance"
          label="Saldo Inicial"
          margin="dense"
          fullWidth
          error={!!errors.balance}
          helperText={errors.balance?.message}
          // Usamos InputProps para o ícone, assim como no TextField original
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">R$</InputAdornment>
            ),
          }}
        />
        <FormControl fullWidth margin="dense" error={!!errors.type}>
          <InputLabel id="account-type-label">Tipo de Conta</InputLabel>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                labelId="account-type-label"
                label="Tipo de Conta"
                {...field}
              >
                {Object.entries(AccountType).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {getAccountTypeLabel(value)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="dense" error={!!errors.bank}>
          <InputLabel id="bank-label">Banco</InputLabel>
          <Controller
            name="bank"
            control={control}
            render={({ field }) => (
              <Select labelId="bank-label" label="Banco" {...field}>
                {loadingBanks ? (
                  <MenuItem value="">
                    <CircularProgress size={20} />
                    <Typography ml={2}>Carregando...</Typography>
                  </MenuItem>
                ) : (
                  banks.map((bank) => (
                    <MenuItem key={bank.code} value={bank.code}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          src={bank.logoUrl}
                          sx={{ width: 40, height: 40 }}
                        />
                        {bank.name}
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          />
          <FormHelperText>{errors.bank?.message}</FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="currency-label">Moeda</InputLabel>
          <Select labelId="currency-label" value="BRL" disabled>
            <MenuItem value="BRL">Real (BRL)</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default NewBankAccountModal;
