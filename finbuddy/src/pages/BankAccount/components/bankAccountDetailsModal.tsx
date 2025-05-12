import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, Button, Box, FormControl,
    InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { BankAccountSchemaType, UpdateBankAccountDTOSchema, UpdateBankAccountDTOSchemaType } from '../../../schemas/BankAccount';
import { useBanks } from '../../../hooks/useBanks';
import { AccountType } from '../../../enums/accountType';
import { zodResolver } from '@hookform/resolvers/zod';

interface BankAccountDetailsModalProps {
    open: boolean;
    bankAccount: BankAccountSchemaType;
    onClose: () => void;
    onDelete: (id: string) => void;
    onUpdate: (updated: UpdateBankAccountDTOSchemaType) => void;
}

const getAccountTypeLabel = (type: AccountType) => {
    switch (type) {
        case AccountType.CHECKING:
            return 'Conta Corrente';
        case AccountType.SAVINGS:
            return 'Poupança';
        case AccountType.INVESTMENT:
            return 'Investimento';
        case AccountType.WALLET:
            return 'Carteira';
        case AccountType.OTHER:
            return 'Outro';
        default:
            return type;
    }
};

const BankAccountDetailsModal: React.FC<BankAccountDetailsModalProps> = ({
    open,
    bankAccount,
    onClose,
    onDelete,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const { banks } = useBanks();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UpdateBankAccountDTOSchemaType>({
        resolver: zodResolver(UpdateBankAccountDTOSchema),
        defaultValues: {
            name: bankAccount.name,
            type: bankAccount.type,
            bank: bankAccount.bank,
            currency: bankAccount.currency,
        },
    });

    useEffect(() => {
        if (bankAccount) {
            reset({
                name: bankAccount.name,
                type: bankAccount.type,
                bank: bankAccount.bank,
                currency: bankAccount.currency,
            });
        }
    }, [bankAccount, reset]);

    const matchedBank = banks.find((bank) => bank.code === bankAccount.bank);

    const onSubmit = (data: Partial<BankAccountSchemaType>) => {
        onUpdate({ ...bankAccount, ...data });
        setIsEditing(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Detalhes da Conta</DialogTitle>
            <DialogContent>
                {!isEditing ? (
                    <Box mt={1}>
                        <Typography variant="body1"><strong>Nome:</strong> {bankAccount.name}</Typography>
                        <Typography variant="body1"><strong>Banco:</strong> {matchedBank?.name || bankAccount.bank}</Typography>
                        <Typography variant="body1"><strong>Saldo:</strong> R$ {bankAccount.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Typography>
                        <Typography variant="body1"><strong>Tipo:</strong> {getAccountTypeLabel(bankAccount.type)}</Typography>
                        <Typography variant="body1"><strong>Moeda:</strong> {bankAccount.currency}</Typography>
                    </Box>
                ) : (
                    <>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Nome"
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <FormControl fullWidth margin="dense" error={!!errors.type}>
                            <InputLabel id="account-type-label">Tipo de Conta</InputLabel>
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <Select labelId="account-type-label" label="Tipo de Conta" {...field}>
                                        {Object.values(AccountType).map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {getAccountTypeLabel(type)}
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
                                control={control}
                                name="bank"
                                render={({ field }) => (
                                    <Select labelId="bank-label" label="Banco" {...field}>
                                        {banks.map((bank) => (
                                            <MenuItem key={bank.code} value={bank.code}>
                                                {bank.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText>{errors.bank?.message}</FormHelperText>
                        </FormControl>

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Moeda"
                            disabled
                            value="BRL"
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="secondary">Cancelar</Button>
                        <Button onClick={handleSubmit(onSubmit)} color="primary">Salvar</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setIsEditing(true)} color="primary">Editar</Button>
                        <Button onClick={() => onDelete(bankAccount.id)} color="error">Deletar</Button>
                        <Button onClick={onClose} color="secondary">Fechar</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BankAccountDetailsModal;
