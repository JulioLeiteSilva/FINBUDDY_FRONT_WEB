import React, { useEffect, useState } from 'react';
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
    Grid,
    Box,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { TransactionRequestDTOSchema, TransactionRequestDTOSchemaType } from '../../../schemas/Transactions';
import { useBankAccountStore } from '../../../store/bankAccountStore';
import { TransactionFrequency } from '../../../enums/';
import { TransactionSchemaType } from '../../../schemas/Transactions';

type dateType = {
    _seconds: number;
    _nanoseconds: number;
};

interface TransactionDetailsModalProps {
    transaction: TransactionSchemaType;
    open: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    onUpdate: (updatedTransaction: TransactionRequestDTOSchemaType) => void;
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

const typeMap: Record<string, string> = {
    INCOME: "Receita",
    EXPENSE: "Despesa",
};

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
    transaction,
    open,
    onClose,
    onDelete,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<TransactionRequestDTOSchemaType>({
        resolver: zodResolver(TransactionRequestDTOSchema),
        defaultValues: {
            name: transaction.name,
            category: transaction.category,
            value: transaction.value,
            date: new Date((transaction.date as unknown as dateType)._seconds * 1000),
            type: transaction.type,
            isRecurring: transaction.isRecurring,
            isPaid: transaction.isPaid,
            currency: transaction.currency,
            bankAccountId: transaction.bankAccountId,
            frequency: transaction.frequency ?? null,
            startDate: transaction.startDate ? new Date((transaction.startDate as unknown as dateType)._seconds * 1000) : null,
            endDate: transaction.endDate ? new Date((transaction.endDate as unknown as dateType)._seconds * 1000) : null,
        },
    });

    const { bankAccounts, fetchBankAccounts } = useBankAccountStore();

    useEffect(() => {
        fetchBankAccounts();
        if (transaction) {
            reset({
                name: transaction.name,
                category: transaction.category,
                value: transaction.value,
                date: new Date((transaction.date as unknown as dateType)._seconds * 1000),
                type: transaction.type,
                isRecurring: transaction.isRecurring,
                isPaid: transaction.isPaid,
                currency: transaction.currency,
                bankAccountId: transaction.bankAccountId,
                frequency: transaction.frequency ?? null,
                startDate: transaction.startDate ? new Date((transaction.startDate as unknown as dateType)._seconds * 1000) : null,
                endDate: transaction.endDate ? new Date((transaction.endDate as unknown as dateType)._seconds * 1000) : null,
            });
        }
    }, [transaction, fetchBankAccounts, reset]);
    const bankAccountName = bankAccounts.find(acc => acc.id === transaction.bankAccountId)?.name || 'Conta não encontrada';

    const isRecurring = useWatch({
        control,
        name: 'isRecurring',
    });

    const onSubmit = (data: TransactionRequestDTOSchemaType) => {
        console.log('Atualizar transação:', data);
        onUpdate(data);
        setIsEditing(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogContent>
                {!isEditing ? (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body1"><strong>Nome:</strong> {transaction.name}</Typography>
                        <Typography variant="body1"><strong>Categoria:</strong> {transaction.category}</Typography>
                        <Typography variant="body1"><strong>Valor:</strong> {transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
                        <Typography variant="body1"><strong>Data:</strong> {dayjs((transaction.date as unknown as dateType)._seconds * 1000).format('DD/MM/YYYY')}</Typography>
                        <Typography variant="body1"><strong>Tipo:</strong> {transaction.type ? typeMap[transaction.type] : '-'}</Typography>
                        <Typography variant="body1"><strong>Pago:</strong> {transaction.isPaid ? 'Sim' : 'Não'}</Typography>
                        <Typography variant="body1"><strong>Recorrente:</strong> {transaction.isRecurring ? 'Sim' : 'Não'}</Typography>
                        {transaction.isRecurring && (
                            <>
                                <Typography variant="body1"><strong>Frequência:</strong> {transaction.frequency ? frequencyMap[transaction.frequency] : '-'}</Typography>
                                <Typography variant="body1"><strong>Início:</strong> {transaction.startDate ? dayjs((transaction.startDate as unknown as dateType)._seconds * 1000).format('DD/MM/YYYY') : '-'}</Typography>
                                <Typography variant="body1"><strong>Fim:</strong> {transaction.endDate ? dayjs((transaction.endDate as unknown as dateType)._seconds * 1000).format('DD/MM/YYYY') : '-'}</Typography>
                            </>
                        )}
                        <Typography variant="body1"><strong>Conta Bancária:</strong> {bankAccountName}</Typography>
                    </Box>
                ) : (
                    <>
                        <TextField
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
                                <FormControl fullWidth margin="dense" error={!!errors.type}>
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
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} color="primary">
                            Salvar
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setIsEditing(true)} color="primary">
                            Editar
                        </Button>
                        <Button onClick={() => onDelete(transaction.id)} color="error">
                            Deletar
                        </Button>
                        <Button onClick={onClose} color="secondary">
                            Fechar
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default TransactionDetailsModal;
