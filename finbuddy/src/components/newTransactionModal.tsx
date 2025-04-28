// src/components/NewTransactionModal.tsx
import React, { useState } from 'react';
import { Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';

export interface NewTransaction {
    id?: string; // O ID será gerado ao adicionar
    date: string;
    description: string;
    amount: number;
    category: string;
}

interface NewTransactionModalProps {
    onClose: () => void;
    onAddNew: (newTransaction: NewTransaction) => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ onClose, onAddNew }) => {
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>('');
    const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD')); // Default para hoje

    const handleSubmit = (event: React.FormEvent) => {
        console.log('handleSubmit')
        event.preventDefault();
        const newTransaction: NewTransaction = {
            date,
            description,
            amount: parseFloat(amount.toString()), // Garante que seja um número
            category,
        };
        console.log(newTransaction)
        onAddNew(newTransaction);
        // Limpa o formulário após adicionar
        setDescription('');
        setAmount(0);
        setCategory('');
        setDate(dayjs().format('YYYY-MM-DD'));
    };

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle id="form-dialog-title">Nova Transação</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Preencha os detalhes da nova transação.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Descrição"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="amount"
                        label="Valor"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                    <TextField
                        margin="dense"
                        id="category"
                        label="Categoria"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button type="submit" color="primary" onClick={handleSubmit}>
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewTransactionModal;