import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BankAccountSchemaType, UpdateBankAccountDTOSchema, UpdateBankAccountDTOSchemaType } from '../../../../schemas/BankAccount';
import { useBanks } from '../../../../hooks/useBanks';
import { AccountDisplayInfo } from './AccountDisplayInfo';
import { AccountEditForm } from './AccountEditForm';

interface BankAccountDetailsModalProps {
    open: boolean;
    bankAccount: BankAccountSchemaType;
    onClose: () => void;
    onDelete: (id: string) => void;
    onUpdate: (updatedData: UpdateBankAccountDTOSchemaType) => void;
}

export const BankAccountDetailsModal: React.FC<BankAccountDetailsModalProps> = ({
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
    });

    // Reseta o formulário e o estado de edição sempre que o modal for fechado ou a conta mudar
    useEffect(() => {
        if (open) {
            reset({
                name: bankAccount.name,
                type: bankAccount.type,
                bank: bankAccount.bank,
                currency: bankAccount.currency,
            });
        } else {
            setIsEditing(false);
        }
    }, [bankAccount, open, reset]);

    const handleUpdate = (data: UpdateBankAccountDTOSchemaType) => {
        onUpdate(data);
        setIsEditing(false);
        // onClose(); // Opcional: Descomente se quiser fechar o modal após salvar
    };

    const handleDelete = () => {
        onDelete(bankAccount.id);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Editar Conta' : 'Detalhes da Conta'}</DialogTitle>
            <DialogContent>
                {isEditing ? (
                    <AccountEditForm
                        control={control}
                        register={register}
                        errors={errors}
                        banks={banks}
                    />
                ) : (
                    <AccountDisplayInfo bankAccount={bankAccount} banks={banks} />
                )}
            </DialogContent>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="secondary">Cancelar</Button>
                        <Button onClick={handleSubmit(handleUpdate)} color="primary">Salvar</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleDelete} color="error" sx={{ mr: 'auto' }}>Deletar</Button>
                        <Button onClick={onClose} color="secondary">Fechar</Button>
                        <Button onClick={() => setIsEditing(true)} color="primary">Editar</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};