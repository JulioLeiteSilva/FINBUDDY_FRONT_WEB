import React, { useMemo } from 'react';
import {
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    InputAdornment,
    Typography,
    Grid
} from '@mui/material';
import { Control, Controller, FieldErrors, UseFormRegister, useWatch } from 'react-hook-form';
import { TransactionRequestDTOSchemaType } from '../../schemas/Transactions';
import { BankAccountSchemaType } from '../../schemas/BankAccount';
import { RecurringTransactionFields } from './RecurringTransactionFields';
import dayjs from 'dayjs';
import { CategorySchemaType } from '../../schemas/Categories';
import GetMuiIcon from '../../utils/getMuiIcon';

interface TransactionFormProps {
    control: Control<TransactionRequestDTOSchemaType>;
    register: UseFormRegister<TransactionRequestDTOSchemaType>;
    errors: FieldErrors<TransactionRequestDTOSchemaType>;
    isRecurring: boolean;
    bankAccounts: BankAccountSchemaType[];
    categories: CategorySchemaType[];
}
export const TransactionForm: React.FC<TransactionFormProps> = ({ control, register, errors, isRecurring, bankAccounts, categories }) => {
    const transactionType = useWatch({
        control,
        name: 'type', // Observando o campo 'type' (INCOME/EXPENSE)
    });

    const filteredCategories = useMemo(() => {
        if (!transactionType) {
            return []; // Se nenhum tipo de transação estiver selecionado, não mostra categorias.
            // Alternativamente, para mostrar todas: return categories;
        }
        // Isso assume que seu CategorySchemaType possui uma propriedade 'type' (ex: 'INCOME' ou 'EXPENSE')
        // que corresponde ao tipo da transação.
        return categories.filter(category => category.type === transactionType);
    }, [categories, transactionType]);

    return (
        <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Preencha os detalhes da nova transação.
            </Typography>

            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Descrição"
                type="text"
                fullWidth
                variant="outlined"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        margin="dense"
                        id="value"
                        label="Valor"
                        type="number"
                        fullWidth
                        variant="outlined"
                        {...register('value', { valueAsNumber: true })}
                        error={!!errors.value}
                        helperText={errors.value?.message}
                        slotProps={{
                            input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth margin="dense" error={!!errors.category}>
                        <InputLabel id="category-label">Categoria</InputLabel>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select
                                    labelId="category-label"
                                    id="category"
                                    value={field.value || ''} // Garante que o valor seja uma string vazia para o Select
                                    label="Categoria"
                                    onChange={field.onChange}
                                >
                                    {filteredCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.icon}>
                                            <GetMuiIcon iconName={category.icon} sx={{ mr: 1 }} />
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>

            <Controller
                control={control}
                name="type"
                render={({ field }) => (
                    <FormControl fullWidth margin="dense" error={!!errors.type}>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>Tipo</Typography>
                        <ToggleButtonGroup
                            value={field.value}
                            exclusive
                            onChange={(_, value) => {
                                if (value !== null) field.onChange(value);
                            }}
                            fullWidth
                            color="primary"
                        >
                            <ToggleButton value="EXPENSE">Despesa</ToggleButton>
                            <ToggleButton value="INCOME">Receita</ToggleButton>
                        </ToggleButtonGroup>
                        {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                    </FormControl>
                )}
            />

            <TextField
                id="date"
                label="Data"
                type="date"
                fullWidth
                margin="dense"
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('date', { setValueAs: (v) => new Date(v) })}
                error={!!errors.date}
                helperText={errors.date?.message}
                defaultValue={dayjs().format('YYYY-MM-DD')}
            />

            <FormControl fullWidth margin="dense" error={!!errors.bankAccountId}>
                <InputLabel id="bankAccountId-label">Conta Bancária</InputLabel>
                <Controller
                    control={control}
                    name="bankAccountId"
                    render={({ field }) => (
                        <Select
                            labelId="bankAccountId-label"
                            id="bankAccountId"
                            value={field.value}
                            label="Conta Bancária"
                            onChange={field.onChange}
                        >
                            {bankAccounts.map((account) => (
                                <MenuItem key={account.id} value={account.id}>
                                    {account.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.bankAccountId && <FormHelperText>{errors.bankAccountId.message}</FormHelperText>}
            </FormControl>

            <Grid container>
                <Grid>
                    <Controller
                        control={control}
                        name="isPaid"
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                                label="Pago?"
                            />
                        )}
                    />
                </Grid>
                <Grid>
                    <Controller
                        control={control}
                        name="isRecurring"
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                                label="Recorrente?"
                            />
                        )}
                    />
                </Grid>
            </Grid>


            {isRecurring && <RecurringTransactionFields control={control} register={register} errors={errors} />}
        </>
    );
};