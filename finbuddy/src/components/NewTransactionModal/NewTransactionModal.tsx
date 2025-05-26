import React, { useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionRequestDTOSchema, TransactionRequestDTOSchemaType } from '../../schemas/Transactions';
import { useBankAccountStore } from '../../store/bankAccountStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { TransactionForm } from './TransactionForm';
import { CategorySchemaType } from '../../schemas/Categories';

interface NewTransactionModalProps {
    onClose: () => void;
    onCreateNew: (newTransaction: TransactionRequestDTOSchemaType) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ onClose, onCreateNew }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<TransactionRequestDTOSchemaType>({
        resolver: zodResolver(TransactionRequestDTOSchema),
        defaultValues: {
            name: '',
            category: '',
            value: 0,
            date: new Date(),
            type: 'EXPENSE',
            isRecurring: false,
            isPaid: false,
            currency: 'BRL',
            bankAccountId: '',
            frequency: null,
            startDate: null,
            endDate: null,
        },
    });

    const { categories, defaultCategories, fetchCategories } = useCategoriesStore();

    const { bankAccounts, fetchBankAccounts } = useBankAccountStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchBankAccounts();
    }, [fetchBankAccounts]);

    const isRecurring = useWatch({
        control,
        name: 'isRecurring',
    });

    const onSubmit = (data: TransactionRequestDTOSchemaType) => {
        console.log('Nova transação:', data);
        onCreateNew(data);
        onClose();
        reset();
    };

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle id="form-dialog-title">Nova Transação</DialogTitle>
            <DialogContent>
                <TransactionForm
                    control={control}
                    register={register}
                    errors={errors}
                    isRecurring={!!isRecurring}
                    bankAccounts={bankAccounts}
                    categories={([...categories, ...defaultCategories]) as CategorySchemaType[]}
                />
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