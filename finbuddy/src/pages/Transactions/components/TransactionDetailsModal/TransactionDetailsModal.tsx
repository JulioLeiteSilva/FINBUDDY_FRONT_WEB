/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/TransactionDetailsModal/TransactionDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTransactionSchema, CreateTransactionType, TransactionType } from '../../../../schemas/Transactions';
import { useBankAccountStore } from '../../../../store/bankAccountStore';
import { formatDateForInput } from './utils/transactionUtils';
import { TransactionDisplayInfo } from './TransactionDisplayInfo';
import { TransactionEditForm } from './TransactionEditForm';

interface TransactionDetailsModalProps {
    transaction: TransactionType;
    open: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    onUpdate: (updatedTransaction: CreateTransactionType) => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
    transaction,
    open,
    onClose,
    onDelete,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const { bankAccounts, fetchBankAccounts } = useBankAccountStore();

    const methods = useForm<CreateTransactionType>({
        resolver: zodResolver(CreateTransactionSchema),
    });

    useEffect(() => {
        if (open) {
            fetchBankAccounts();
            // Reseta o formulário com os dados da transação atual ao abrir ou mudar de transação
            methods.reset({
                name: transaction.name,
                category: transaction.category,
                value: transaction.value,
                date: formatDateForInput(transaction.date) as any, // Formatado para o input 'date'
                type: transaction.type,
                isRecurring: transaction.isRecurring,
                isPaid: transaction.isPaid,
                currency: transaction.currency,
                bankAccountId: transaction.bankAccountId,
                frequency: transaction.frequency ?? null,
                startDate: transaction.startDate ? formatDateForInput(transaction.startDate) as any : null,
                endDate: transaction.endDate ? formatDateForInput(transaction.endDate) as any : null,
            });
        } else {
            setIsEditing(false);
        }
    }, [transaction, open, methods.reset, fetchBankAccounts, methods]);

    const bankAccountName = bankAccounts.find(acc => acc.id === transaction.bankAccountId)?.name || 'Conta não encontrada';

    const onSubmit = (data: CreateTransactionType) => {
        onUpdate(data);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(transaction.id);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Editar Transação' : 'Detalhes da Transação'}</DialogTitle>
            <FormProvider {...methods}>
                <DialogContent>
                    {isEditing ? (
                        <TransactionEditForm />
                    ) : (
                        <TransactionDisplayInfo transaction={transaction} bankAccountName={bankAccountName} />
                    )}
                </DialogContent>
            </FormProvider>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="secondary">Cancelar</Button>
                        <Button onClick={methods.handleSubmit(onSubmit)} color="primary">Salvar</Button>
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