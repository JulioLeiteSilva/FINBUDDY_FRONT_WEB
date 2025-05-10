// src/components/NewTransactionModal.tsx
import React, { useEffect } from 'react';
import {
    Typography,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { TransactionRequestDTOSchema, TransactionRequestDTOSchemaType } from '../schemas/transactions';
import { useBankAccountStore } from '../store/bankAccountStore';
import { TransactionFrequency } from '../enums/'; // ajuste o path conforme seu projeto
import { Grid } from '@mui/material';

interface NewTransactionModalProps {
    onClose: () => void;
    onCreateNew: (newTransaction: TransactionRequestDTOSchemaType) => void;
}

const frequencyMap: Record<string, string> = {
    WEEKLY: "Semanal",
    BIWEEKLY: "Bi-semanal",
    MONTHLY: "Mensal",
    BIMONTHLY: "Bimestral",
    QUARTERLY: "Trimestral",
    SEMIANNUALLY: "Semestral",
    ANNUALLY: "Anualmente",
};

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ onClose, onCreateNew }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<TransactionRequestDTOSchemaType>({
        resolver: zodResolver(TransactionRequestDTOSchema),
        defaultValues: {
            name: '',
            category: '',
            value: 1,
            date: new Date(),
            type: 'EXPENSE',
            isRecurring: false,
            isPaid: false,
            currency: 'BRL',
            bankAccountId: '',
            frequency: null,
            startDate: null,
            endDate: null,
        }
    });

    const { bankAccounts, fetchBankAccounts } = useBankAccountStore();

    // Faz fetch quando o modal abre
    useEffect(() => {
        fetchBankAccounts();
    }, [fetchBankAccounts]);

    const onSubmit = (data: TransactionRequestDTOSchemaType) => {
        console.log('Nova transação:', data);
        onCreateNew(data);
        onClose();
        reset(); // reseta o formulário após enviar
    };

    // Watch para isRecurring
    const isRecurring = useWatch({
        control,
        name: 'isRecurring',
    });

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle id="form-dialog-title">Nova Transação</DialogTitle>
            <DialogContent>
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
                        input: {
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        },
                    }}
                />

                <TextField
                    margin="dense"
                    id="category"
                    label="Categoria"
                    type="text"
                    fullWidth
                    variant="outlined"
                    {...register('category')}
                    error={!!errors.category}
                    helperText={errors.category?.message}
                />

                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <FormControl
                            fullWidth
                            margin="dense"
                            error={!!errors.type}
                        >
                            <Typography sx={{ mt: 2 }}>Tipo</Typography>
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
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register('date', {
                        setValueAs: (value) => new Date(value),
                    })}
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

                <Controller
                    control={control}
                    name="isPaid"
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Pago?"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="isRecurring"
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Recorrente?"
                        />
                    )}
                />

                {isRecurring && (
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormControl fullWidth margin="dense" error={!!errors.frequency}>
                                <InputLabel id="frequency-label">Frequência</InputLabel>
                                <Controller
                                    control={control}
                                    name="frequency"
                                    render={({ field }) => (
                                        <Select
                                            labelId="frequency-label"
                                            id="frequency"
                                            value={field.value ?? ''}
                                            label="Frequência"
                                            onChange={field.onChange}
                                        >
                                            {Object.values(TransactionFrequency).map((freq) => (
                                                <MenuItem key={freq} value={freq}>
                                                    {frequencyMap[freq]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.frequency && <FormHelperText>{errors.frequency.message}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                id="startDate"
                                label="Data Início"
                                type="date"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register('startDate', {
                                    setValueAs: (value) => (value ? new Date(value) : null),
                                })}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                            />
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                id="endDate"
                                label="Data Fim"
                                type="date"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register('endDate', {
                                    setValueAs: (value) => (value ? new Date(value) : null),
                                })}
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message}
                            />
                        </Grid>
                    </Grid>
                )}
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

export default NewTransactionModal;
