// src/pages/Transactions/index.tsx (ou o caminho do seu arquivo)

import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, InputAdornment, TextField, Typography, IconButton } from "@mui/material";
import TransactionListByDay from "./components/TransactionListByDay"; // Ajuste o caminho se necessário
import { useTransactionsStore } from "../../store/transactionStore"; // Ajuste o caminho
import { Search } from "@mui/icons-material";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { firestoreTimestampToDate } from "./components/TransactionDetailsModal/utils/transactionUtils";
import { useCategoriesStore } from "../../store/categoriesStore";

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

type TransactionTypeFilter = 'all' | 'INCOME' | 'EXPENSE';

const TransactionsPage = () => {
    const { transactions, isLoading, fetchTransactions } = useTransactionsStore();
    const [filterType, setFilterType] = useState<TransactionTypeFilter>('all');
    const [searchText, setSearchText] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const { fetchCategories } = useCategoriesStore();

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handlePreviousMonth = () => {
        setSelectedMonth(prev => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setSelectedMonth(prev => prev.add(1, 'month'));
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const transactionDate = firestoreTimestampToDate(transaction.date);
            if (!transactionDate) return false;
            const transactionDateDayjs = dayjs(transactionDate);

            const matchesMonth = transactionDateDayjs.isValid() && transactionDateDayjs.year() === selectedMonth.year() && transactionDateDayjs.month() === selectedMonth.month();

            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'INCOME' && transaction.type === 'INCOME') ||
                (filterType === 'EXPENSE' && transaction.type === 'EXPENSE');

            const matchesSearch =
                searchText === '' ||
                transaction.name.toLowerCase().includes(searchText.toLowerCase()) ||
                (transaction.category && transaction.category.toLowerCase().includes(searchText.toLowerCase()));

            return matchesMonth && matchesFilter && matchesSearch;
        });
    }, [transactions, filterType, searchText, selectedMonth]);

    const handleFilterChange = (newFilter: TransactionTypeFilter) => {
        setFilterType(newFilter);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    // Função que será chamada pelo TransactionListByDay para recarregar os dados
    const handleDataChange = () => {
        fetchTransactions();
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}> {/* Padding responsivo */}
            <Card sx={{ m: 'auto', overflow: 'visible' }}> {/* `overflow: 'visible'` pode ajudar com tooltips de botões */}
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
                        Histórico de Transações
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2.5 }}>
                        <IconButton onClick={handlePreviousMonth} aria-label="Mês anterior">
                            <ChevronLeftIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ minWidth: { xs: '160px', sm: '200px' }, textAlign: 'center', textTransform: 'capitalize' }}>
                            {selectedMonth.format('MMMM [de] YYYY')}
                        </Typography>
                        <IconButton onClick={handleNextMonth} aria-label="Próximo mês">
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, alignItems: 'center' }}>
                        <TextField
                            label="Pesquisar por nome ou categoria"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchText}
                            onChange={handleSearchChange}
                            slotProps={{
                                input: {
                                    startAdornment: ( // Movido para startAdornment para melhor UX
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                        <ButtonGroup variant="outlined" aria-label="Filtro de tipo de transação" size="small">
                            <Button onClick={() => handleFilterChange('all')} variant={filterType === 'all' ? "contained" : "outlined"}>
                                Todas
                            </Button>
                            <Button onClick={() => handleFilterChange('INCOME')} variant={filterType === 'INCOME' ? "contained" : "outlined"}>
                                Receitas
                            </Button>
                            <Button onClick={() => handleFilterChange('EXPENSE')} variant={filterType === 'EXPENSE' ? "contained" : "outlined"}>
                                Despesas
                            </Button>
                        </ButtonGroup>
                    </Box>

                    <TransactionListByDay
                        transactions={filteredTransactions}
                        isLoading={isLoading}
                        onDataChange={handleDataChange}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

export default TransactionsPage;
